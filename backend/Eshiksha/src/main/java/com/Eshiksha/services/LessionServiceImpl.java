package com.Eshiksha.services;

import com.Eshiksha.Entities.Course;
import com.Eshiksha.Entities.Lession;
import com.Eshiksha.Entities.LessionDoubt;
import com.Eshiksha.repositories.DoubtRepository;
import com.Eshiksha.repositories.LessionRepository;
import com.Eshiksha.websocket.VideoProgressWebSocket;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class LessionServiceImpl implements LessionService {
    private LessionRepository lessionRepository;
    private CourseService courseService;

    private VideoService videoService;

    private DoubtRepository doubtRepository;

    private static final String VIDEO_DIRECTORY = "./lession";
    private final Map<String, int[]> threadProgressMap = new ConcurrentHashMap<>(); // [thread1, thread2, thread3, thread4]
    private final Map<String, AtomicInteger> cumulativeProgressMap = new ConcurrentHashMap<>();

    private VideoProgressWebSocket progressWebSocket;


    public LessionServiceImpl(LessionRepository lessionRepository, CourseService courseService, VideoService videoService, DoubtRepository doubtRepository, VideoProgressWebSocket progressWebSocket) {
        this.courseService = courseService;
        this.lessionRepository = lessionRepository;
        this.videoService = videoService;
        this.doubtRepository = doubtRepository;
        this.progressWebSocket = progressWebSocket;
    }

    @Override
    public void saveLession(Lession lession) {
        this.lessionRepository.save(lession);
    }

    @Override
    public Lession findLessionById(int lessionId) {
        return this.lessionRepository.findByLessionId(lessionId);
    }

    @Override
    public Lession createLession(int courseId, String title, String description,
                                 int sequenceNumber, String resources, String status, MultipartFile videoFile) throws Exception {
        try {
            Course course = courseService.getCourseById(courseId);
            if (course == null) {
                throw new Exception("Course not found with Id : " + courseId);
            }

            Path coursePath = Paths.get(VIDEO_DIRECTORY, "course_" + courseId);
            if (!Files.exists(coursePath)) {
                Files.createDirectories(coursePath);
            }

            String lessonFolderName = "lesson_" + System.currentTimeMillis();
            Path lessonPath = coursePath.resolve(lessonFolderName);
            Files.createDirectories(lessonPath);

            String originalFileName = videoFile.getOriginalFilename();
            String videoFileName = lessonFolderName + "_" + originalFileName;
            Path videoPath = lessonPath.resolve(videoFileName);

            Files.write(videoPath, videoFile.getBytes());

            String[] resolutions = {"360p", "480p", "720p", "1080p"};
            Map<String, String> resolutionMap = Map.of(
                    "360p", "640x360", "480p", "854x480", "720p", "1280x720", "1080p", "1920x1080"
            );

            threadProgressMap.put(String.valueOf(courseId), new int[resolutions.length]);
            cumulativeProgressMap.put(String.valueOf(courseId), new AtomicInteger(0));
            int duration = videoService.getVideoDuration(videoFile);

            ExecutorService executor = Executors.newFixedThreadPool(resolutions.length);
            for (int i = 0; i < resolutions.length; i++) {
                final int threadIndex = i;
                executor.execute(() -> {
                    processVideo(lessonPath, videoFileName, resolutions[threadIndex], resolutionMap.get(resolutions[threadIndex]), String.valueOf(courseId), duration, threadIndex);
                });
            }

            executor.shutdown();
            executor.awaitTermination(10, TimeUnit.MINUTES);

            videoService.createMasterPlaylist(lessonPath, resolutions);

            Lession lession = new Lession();
            lession.setTitle(title);
            lession.setDescription(description);
            lession.setContentUrl(lessonPath.toString());
            lession.setDuration(Duration.ofSeconds(videoService.getVideoDuration(videoFile)));
            lession.setSequenceNumber(sequenceNumber);
            lession.setCourse(course);
            lession.setResources(resources);
            lession.setStatus(status);
            lession.setCreatedAt(LocalDateTime.now());
            lession.setUpdatedAt(LocalDateTime.now());

            saveLession(lession);
            course.getLessions().add(lession);
            courseService.saveCourse(course);
            threadProgressMap.remove(String.valueOf(courseId));
            cumulativeProgressMap.remove(String.valueOf(courseId));

            return lession;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    public void processVideo(Path basePath, String videoFileName, String resolution, String resolutionSize, String courseId, int duration, int threadIndex) {
        try {
            Path resolutionPath = basePath.resolve(resolution);
            Files.createDirectories(resolutionPath);

            String outputPlaylist = resolutionPath.resolve("playlist.m3u8").toString();
            String outputSegments = resolutionPath.resolve("segment_%03d.ts").toString();
            String inputFilePath = basePath.resolve(videoFileName).toString();

            String ffmpegCmd = String.format(
                    "ffmpeg -i \"%s\" -vf scale=%s -c:v libx264 -c:a aac -strict -2 " +
                            "-f hls -hls_time 10 -hls_list_size 0 -hls_segment_filename \"%s\" \"%s\"",
                    inputFilePath, resolutionSize, outputSegments, outputPlaylist
            );

            ProcessBuilder processBuilder = new ProcessBuilder("cmd.exe", "/c", ffmpegCmd);
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("FFmpeg Output for thread " + threadIndex + " : " + line);
                if (line.contains("time=")) {
                    String timeStr = line.substring(line.indexOf("time=") + 5, line.indexOf("time=") + 13);
                    if (!timeStr.contains("N/A")) {
                        try {
                            String[] timeParts = timeStr.split(":");
                            double seconds = Integer.parseInt(timeParts[0]) * 3600 +
                                    Integer.parseInt(timeParts[1]) * 60 +
                                    Double.parseDouble(timeParts[2]);
                            int progressPercentage = (int) ((seconds / duration) * 100.0);

                            if (progressPercentage > 0 && progressPercentage <= 100) {
                                threadProgressMap.get(courseId)[threadIndex] = progressPercentage;
                                int cumulativeProgress = calculateCumulativeProgress(courseId);
                                cumulativeProgressMap.get(courseId).set(cumulativeProgress);
                                progressWebSocket.sendProgress(courseId, "PROGRESS:" + cumulativeProgress);
                            }
                        } catch (NumberFormatException e) {
                            System.out.println("Exception parsing time: " + e.getMessage());
                        }
                    }
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new RuntimeException("Video processing failed for " + resolution);
            }
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException("Error processing video for " + resolution + ": " + e.getMessage());
        }
    }

    private int calculateCumulativeProgress(String courseId) {
        int[] threadProgress = threadProgressMap.get(courseId);
        int cumulativeProgress = 0;
        for (int progress : threadProgress) {
            cumulativeProgress += progress / threadProgress.length;
        }
        return cumulativeProgress;
    }


//    @Override
//    public Lession createLession(int courseId, String title, String description, long durationInSeconds, int sequenceNumber, String resources, String status, MultipartFile videoFile) throws Exception {
//        try{
//            Course course = courseService.getCourseById(courseId);
//            if (course == null) {
//
//                throw new Exception("Course not found with Id : " + courseId);
//
//            }
//
//
//            Path coursePath = Paths.get(VIDEO_DIRECTORY, "course_" + courseId);
//            if (!Files.exists(coursePath)) {
//                Files.createDirectories(coursePath);
//            }
//
//
//            String lessonFolderName = "lesson_" + System.currentTimeMillis();
//            Path lessonPath = coursePath.resolve(lessonFolderName);
//            Files.createDirectories(lessonPath);
//
//
//            String originalFileName = videoFile.getOriginalFilename();
//            String videoFileName = lessonFolderName + "_" + originalFileName;
//            Path videoPath = lessonPath.resolve(videoFileName);
//
//
//            Files.write(videoPath, videoFile.getBytes());
//
//
//            String[] resolutions = {"360p", "480p", "720p", "1080p"};
//            Map<String, String> resolutionMap = Map.of(
//                    "360p", "640x360",
//                    "480p", "854x480",
//                    "720p", "1280x720",
//                    "1080p", "1920x1080"
//            );
//
//
//            for (String res : resolutions) {
//                Path resolutionPath = lessonPath.resolve(res);
//                if (!Files.exists(resolutionPath)) {
//                    Files.createDirectories(resolutionPath);
//                }
//            }
//
//
//            ExecutorService executor = Executors.newFixedThreadPool(resolutions.length);
//            for (String res : resolutions) {
//                executor.execute(() -> videoService.processVideo(lessonPath, videoFileName, res, resolutionMap.get(res)));
//            }
//            executor.shutdown();
//            executor.awaitTermination(10, TimeUnit.MINUTES);
//
//
//            videoService.createMasterPlaylist(lessonPath, resolutions);
//
//
//            Lession lession = new Lession();
//            lession.setTitle(title);
//            lession.setDescription(description);
//            lession.setContentUrl(lessonPath.toString());
//            lession.setDuration(Duration.ofSeconds(videoService.getVideoDuration(videoFile)));
//            lession.setSequenceNumber(sequenceNumber);
//            lession.setCourse(course);
//            lession.setResources(resources);
//            lession.setStatus(status);
//            lession.setCreatedAt(LocalDateTime.now());
//            lession.setUpdatedAt(LocalDateTime.now());
//
//            saveLession(lession);
//            System.out.println("lession id : " + lession.getLessionId());
//
//            course.getLessions().add(lession);
//
//            courseService.saveCourse(course);
//
//            return lession;
//        }catch (Exception e){
//            throw new Exception(e.getMessage());
//        }
//    }

    @Override
    public List<Lession> getAllLessions() {
        return lessionRepository.findAll();
    }

    @Override
    public List<LessionDoubt> findDoubtsByLessonId(int lessonId) {
        return doubtRepository.findByLession_LessionId(lessonId);
    }


}
