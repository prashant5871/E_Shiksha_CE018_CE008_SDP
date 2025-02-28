package com.Eshiksha.services;

import com.Eshiksha.Entities.Course;
import com.Eshiksha.Entities.Lession;
import com.Eshiksha.repositories.LessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service
public class LessionServiceImpl implements LessionService {
    private LessionRepository lessionRepository;
    private CourseService courseService;

    private static final String VIDEO_DIRECTORY = "./lession";


    public LessionServiceImpl(LessionRepository lessionRepository,CourseService courseService) {
        this.courseService = courseService;
        this.lessionRepository = lessionRepository;
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
    public Lession createLession(int courseId, String title, String description, long durationInSeconds, int sequenceNumber, String resources, String status, MultipartFile videoFile) throws Exception {
        try{
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
                    "360p", "640x360",
                    "480p", "854x480",
                    "720p", "1280x720",
                    "1080p", "1920x1080"
            );


            for (String res : resolutions) {
                Path resolutionPath = lessonPath.resolve(res);
                if (!Files.exists(resolutionPath)) {
                    Files.createDirectories(resolutionPath);
                }
            }


            ExecutorService executor = Executors.newFixedThreadPool(resolutions.length);
            for (String res : resolutions) {
                executor.execute(() -> processVideo(lessonPath, videoFileName, res, resolutionMap.get(res)));
            }
            executor.shutdown();
            executor.awaitTermination(10, TimeUnit.MINUTES);


            createMasterPlaylist(lessonPath, resolutions);


            Lession lession = new Lession();
            lession.setTitle(title);
            lession.setDescription(description);
            lession.setContentUrl(lessonPath.toString());
            lession.setDuration(Duration.ofSeconds(durationInSeconds));
            lession.setSequenceNumber(sequenceNumber);
            lession.setCourse(course);
            lession.setResources(resources);
            lession.setStatus(status);
            lession.setCreatedAt(LocalDateTime.now());
            lession.setUpdatedAt(LocalDateTime.now());

            saveLession(lession);
            System.out.println("lession id : " + lession.getLessionId());

            course.getLessions().add(lession);

            courseService.saveCourse(course);

            return lession;
        }catch (Exception e){
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public List<Lession> getAllLessions() {
        return lessionRepository.findAll();
    }

    /**
     * 🛠️ Process video into different resolutions and generate HLS playlist (.m3u8)
     */
    private void processVideo(Path lessonPath, String videoFileName, String resolution, String resolutionSize) {
        try {
            Path resolutionPath = lessonPath.resolve(resolution);
            Files.createDirectories(resolutionPath);

            String outputPlaylist = resolutionPath.resolve("playlist.m3u8").toString();
            String outputSegments = resolutionPath.resolve("segment_%03d.ts").toString();
            String inputFilePath = lessonPath.resolve(videoFileName).toString();


            String ffmpegCmd = String.format(
                    "ffmpeg -i \"%s\" -vf scale=%s -c:v libx264 -c:a aac -strict -2 " +
                            "-f hls -hls_time 10 -hls_list_size 0 -hls_segment_filename \"%s\" \"%s\"",
                    inputFilePath, resolutionSize, outputSegments, outputPlaylist
            );

            ProcessBuilder processBuilder = new ProcessBuilder("cmd.exe", "/c", ffmpegCmd);
            processBuilder.inheritIO();
            Process process = processBuilder.start();
            int exitCode = process.waitFor();

            if (exitCode != 0) {
                throw new RuntimeException("Video processing failed for " + resolution);
            }
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException("Error processing video for " + resolution + ": " + e.getMessage());
        }
    }

    /**
     * 🛠️ Create Master Playlist (`master.m3u8`) referencing all available resolutions
     */
    private void createMasterPlaylist(Path lessonPath, String[] resolutions) {
        try {
            Path masterPlaylistPath = lessonPath.resolve("master.m3u8");

            List<String> masterPlaylist = new ArrayList<>();
            masterPlaylist.add("#EXTM3U");


            for (String res : resolutions) {
                String bandwidth = switch (res) {
                    case "360p" -> "800000";
                    case "480p" -> "1400000";
                    case "720p" -> "2800000";
                    case "1080p" -> "5000000";
                    default -> throw new IllegalArgumentException("Invalid resolution");
                };

                String resolutionSize = switch (res) {
                    case "360p" -> "640x360";
                    case "480p" -> "854x480";
                    case "720p" -> "1280x720";
                    case "1080p" -> "1920x1080";
                    default -> throw new IllegalArgumentException("Invalid resolution");
                };

                masterPlaylist.add(String.format("#EXT-X-STREAM-INF:BANDWIDTH=%s,RESOLUTION=%s", bandwidth, resolutionSize));
                masterPlaylist.add(res + "/playlist.m3u8");
            }


            Files.write(masterPlaylistPath, masterPlaylist, StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException("Error creating master playlist: " + e.getMessage());
        }
    }

}
