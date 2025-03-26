package com.Eshiksha.services;

import com.Eshiksha.websocket.VideoProgressWebSocket;
import jakarta.servlet.http.HttpServletResponse;
import net.bramp.ffmpeg.FFprobe;
import net.bramp.ffmpeg.probe.FFmpegProbeResult;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service
public class VideoService {
    private VideoProgressWebSocket progressWebSocket;

    public VideoService(VideoProgressWebSocket progressWebSocket) {
        this.progressWebSocket = progressWebSocket;
    }

    public String processDummyVideo(MultipartFile videoFile, String courseId) throws IOException, InterruptedException {
        // Create a unique directory for the video
        Path demoVideoDir = Paths.get("./video/", UUID.randomUUID().toString());

        if (!Files.exists(demoVideoDir)) {
            Files.createDirectories(demoVideoDir);
        }

        // Ensure we are writing to a file, not a directory
        String videoFileName = videoFile.getOriginalFilename();
        Path videoFilePath = demoVideoDir.resolve(videoFileName);

        // Write video file to disk
        Files.write(videoFilePath, videoFile.getBytes());

        String[] resolutions = {"360p", "480p", "720p", "1080p"};
        Map<String, String> resolutionMap = Map.of(
                "360p", "640x360",
                "480p", "854x480",
                "720p", "1280x720",
                "1080p", "1920x1080"
        );

        // Create resolution directories
        for (String res : resolutions) {
            Path resolutionPath = demoVideoDir.resolve(res);
            if (!Files.exists(resolutionPath)) {
                Files.createDirectories(resolutionPath);
            }
        }

        // Process the video using multiple threads
        ExecutorService executor = Executors.newFixedThreadPool(resolutions.length);
        for (String res : resolutions) {
            executor.execute(() -> {

                    processVideo(demoVideoDir, videoFileName, res, resolutionMap.get(res),courseId);

            });
        }

        executor.shutdown();
        executor.awaitTermination(10, TimeUnit.MINUTES);

        return createMasterPlaylist(demoVideoDir, resolutions);
    }


    public void processVideo(Path basePath, String videoFileName, String resolution, String resolutionSize,String courseId) {
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
            processBuilder.redirectErrorStream(true); // Redirect error stream to input stream.
            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                // Parse FFmpeg output for progress if needed.
                System.out.println("FFmpeg Output: " + line); // Print every line
//                if (line.contains("progress=")) {
//                    System.out.println("line contians progress=");
                    // Extract progress data and send it back to the client.
                    // This is a simplified example; you might need more robust parsing.
                    if (line.contains("time=")) {
                        System.out.println("line contians time=");

                        String timeStr = line.substring(line.indexOf("time=") + 5, line.indexOf("time=") + 13);
                        if (!timeStr.contains("N/A")) { // Check for N/A
                            String[] timeParts = timeStr.split(":");
                            try{
                                double seconds = Integer.parseInt(timeParts[0]) * 3600 +
                                        Integer.parseInt(timeParts[1]) * 60 +
                                        Double.parseDouble(timeParts[2]);

                                int progressPercentage = (int) ((seconds / 100.0) * 100.0);
                                if (progressPercentage >= 0 && progressPercentage <= 100) {
                                    System.out.println("websocket getse executed");
                                    progressWebSocket.sendProgress(courseId, "PROGRESS:" + progressPercentage);
                                }
                            }catch(NumberFormatException e){
                                System.out.println("Exception parsing time: " + e.getMessage());
                            }

                        }else{
                            System.out.println("Time is N/A, skipping progress update.");
                        }
                    }
//                }
            }

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
    public String createMasterPlaylist(Path basePath, String[] resolutions) {
        try {
            Path masterPlaylistPath = basePath.resolve("master.m3u8");

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

            return basePath.toAbsolutePath().toString();
        } catch (IOException e) {
            throw new RuntimeException("Error creating master playlist: " + e.getMessage());
        }
    }

    public int getVideoDuration(MultipartFile file) throws IOException, InterruptedException {
        // 1️⃣ Define the uploads directory and ensure it exists
        Path uploadDir = Paths.get("uploads");
        if(!uploadDir.toFile().exists())
            Files.createDirectories(uploadDir); // Creates directory if not exists

        // 2️⃣ Define the file path
        Path filePath = uploadDir.resolve(file.getOriginalFilename());

        // 3️⃣ Save the uploaded file properly
        Files.write(filePath, file.getBytes());

        // 4️⃣ Run FFmpeg command to get video duration
        ProcessBuilder processBuilder = new ProcessBuilder(
                "cmd.exe", "/c", "ffprobe -i \"" + filePath.toString() + "\" -show_entries format=duration -v quiet -of csv=\"p=0\""
        );

        Process process = processBuilder.start();
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

        String durationStr = reader.readLine();
        process.waitFor(); // Wait for process to finish

        // 5️⃣ Delete the file after processing
        Files.deleteIfExists(filePath);

        // 6️⃣ Convert duration to integer seconds
        if (durationStr != null && !durationStr.isEmpty()) {
            return (int) Math.round(Double.parseDouble(durationStr.trim()));
        } else {
            throw new RuntimeException("Failed to retrieve video duration");
        }
    }
}
