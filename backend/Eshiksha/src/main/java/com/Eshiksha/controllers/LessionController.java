package com.Eshiksha.controllers;

import com.Eshiksha.AppConstants;
import com.Eshiksha.Entities.Course;
import com.Eshiksha.Entities.Lession;
import com.Eshiksha.services.CourseService;
import com.Eshiksha.services.LessionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
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

@RestController
@RequestMapping("/lessions")
public class LessionController {

//    private final Map<String, Long> lastRequestTime = new ConcurrentHashMap<>();
//    private final Map<String, Long> lastChunkSize = new ConcurrentHashMap<>();
//
//    // **Estimated bitrates (in bits per second) for different qualities**
//    private final Map<String, Long> bitrateMap = Map.of(
//            "360p", 800_000L,   // 0.8 Mbps
//            "480p", 1_500_000L, // 1.5 Mbps
//            "720p", 3_000_000L  // 3 Mbps
//    );



//
//    @Autowired
//    private CourseService courseService;
//
//    private static final String VIDEO_DIRECTORY = "./lession";
//
//    private static final String[] RESOLUTIONS = {"360p", "480p", "720p", "1080p"};
//    private static final ExecutorService executor = Executors.newFixedThreadPool(4);

    @Autowired
    private LessionService lessionService;

    @GetMapping
    public ResponseEntity<?> getAllLessions()
    {
        List<Lession> lessions = lessionService.getAllLessions();

        return ResponseEntity.ok().body(lessions);
    }

    @PostMapping("/{courseId}")
    public void createLesson(@PathVariable int courseId,
                             @RequestParam("title") String title,
                             @RequestParam("description") String description,
                             @RequestParam("duration") long durationInSeconds,
                             @RequestParam("sequenceNumber") int sequenceNumber,
                             @RequestParam("resources") String resources,
                             @RequestParam("status") String status,
                             @RequestParam("lession") MultipartFile videoFile,
                             HttpServletResponse response) throws IOException {
        try {
            response.setContentType("text/plain");
            response.setCharacterEncoding("UTF-8");
            lessionService.createLession(courseId, title, description, durationInSeconds, sequenceNumber, resources, status, videoFile);
        } catch (Exception e) {
            response.getOutputStream().write(("Error: " + e.getMessage()).getBytes(StandardCharsets.UTF_8));
        }
    }



    @GetMapping("/stream/{courseId}/{lessonId}/master.m3u8")
    public ResponseEntity<Resource> getMasterPlaylist(@PathVariable int courseId, @PathVariable int lessonId) {
        try {
            System.out.println("Come for master.m3u8 file...");
            Lession lession = lessionService.findLessionById(lessonId);
            String basePath = lession.getContentUrl();
            Path path = Paths.get(basePath, "master.m3u8");
            Resource resource = new UrlResource(path.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=master.m3u8")
                        .contentType(MediaType.APPLICATION_OCTET_STREAM) // For .ts segments, if needed
                        .contentType(MediaType.valueOf("application/x-mpegURL")) // For .m3u8
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/stream/{courseId}/{lessionId}/{resolution}/playlist.m3u8")
    public ResponseEntity<Resource> getResolutionPlaylist(
            @PathVariable int courseId,
            @PathVariable int lessionId,
            @PathVariable String resolution) {
        try {

            Lession lession = lessionService.findLessionById(lessionId);
            String base_path = lession.getContentUrl();
            Path playlistPath = Paths.get(base_path, resolution, "playlist.m3u8");

            if (!Files.exists(playlistPath)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            Resource resource = new UrlResource(playlistPath.toUri());
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType("application/vnd.apple.mpegurl"))
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/stream/{courseId}/{lessonId}/{resolution}/{segmentName:.+\\.ts}")
    public ResponseEntity<Resource> getVideoSegment(
            @PathVariable int courseId,
            @PathVariable int lessonId,
            @PathVariable String resolution,
            @PathVariable String segmentName) {
        try {
            Lession lession = lessionService.findLessionById(lessonId);
            String basePath = lession.getContentUrl();
            Path segmentPath = Paths.get(basePath, resolution, segmentName);
            System.out.println(segmentPath.toString());
            if (!Files.exists(segmentPath)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            Resource resource = new UrlResource(segmentPath.toUri());
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType("video/MP2T"))
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @GetMapping("/stream/{lessionId}")
    public ResponseEntity<Resource> stream(@PathVariable int lessionId) {

        System.out.println("Request come for the id  : " + lessionId);

        Lession lession = lessionService.findLessionById(lessionId);
        if (lession != null) {
            System.out.println("\nlession is not null");
        }
//        String contentType = lession.();
        String contentType = null;
        String filePath = lession.getContentUrl();
        System.out.println("\nFile path : " + filePath);
        Resource resource = new FileSystemResource(filePath);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }


        return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType)).body(resource);


    }

     /*
        @PostMapping("/{courseId}")
        public ResponseEntity<String> createLession(@PathVariable int courseId,
                                                    @RequestParam("title") String title,
                                                    @RequestParam("description") String description,
                                                    @RequestParam("duration") long durationInSeconds,
                                                    @RequestParam("sequenceNumber") int sequenceNumber,
                                                    @RequestParam("resources") String resources,
                                                    @RequestParam("status") String status,
                                                    @RequestParam("lession") MultipartFile videoFile) {
            try {
                // Validate course existence
                System.out.println("inside controller\n");
                Course course = courseService.getCourseById(courseId);
                if (course == null) {
                    return ResponseEntity.badRequest().body("Course not found with ID: " + courseId);
                }

                // Save lession file to local file system
                if (!Files.exists(Paths.get(VIDEO_DIRECTORY))) {
                    Files.createDirectories(Paths.get(VIDEO_DIRECTORY));
                }

                String originalFileName = videoFile.getOriginalFilename();
                String videoFileName = "course_" + courseId + "_lession_" + System.currentTimeMillis() + "_" + originalFileName;
                Path videoPath = Paths.get(VIDEO_DIRECTORY, videoFileName);
                Files.write(videoPath, videoFile.getBytes());

                // Create and save lession
                Lession lession = new Lession();
                lession.setTitle(title);
                lession.setDescription(description);
                lession.setContentUrl(videoPath.toString());
                lession.setDuration(Duration.ofSeconds(durationInSeconds));
                lession.setSequenceNumber(sequenceNumber);
                lession.setCourse(course);
                lession.setResources(resources);
                lession.setStatus(status);
                lession.setCreatedAt(LocalDateTime.now());
                lession.setUpdatedAt(LocalDateTime.now());

                lessionService.saveLession(lession);

                return ResponseEntity.ok("Lession created successfully with ID: " + lession.getLessionId());
            } catch (IOException e) {
                return ResponseEntity.status(500).body("Error saving lession file: " + e.getMessage());
            } catch (Exception e) {
                return ResponseEntity.status(500).body("An error occurred: " + e.getMessage());
            }
        }



     */


/*

    // stream lession in chunks
    @GetMapping("/stream/range/{lessionId}")
    public ResponseEntity<Resource> streamVideoRange(@PathVariable int lessionId, @RequestHeader(value = "Range", required = false) String range) {
        System.out.println(range);
        //

        Lession lession = lessionService.findLessionById(lessionId);
        Path path = Paths.get(lession.getContentUrl());

        Resource resource = new FileSystemResource(path);

        String contentType = null;

        if (contentType == null) {
            contentType = "application/octet-stream";

        }

        //file ki length
        long fileLength = path.toFile().length();


        //pahle jaisa hi code hai kyuki range header null
        if (range == null) {
            return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType)).body(resource);
        }

        //calculating start and end range

        long rangeStart;

        long rangeEnd;

        String[] ranges = range.replace("bytes=", "").split("-");
        rangeStart = Long.parseLong(ranges[0]);

        rangeEnd = rangeStart + AppConstants.CHUNK_SIZE - 1;

        if (rangeEnd >= fileLength) {
            rangeEnd = fileLength - 1;
        }

//        if (ranges.length > 1) {
//            rangeEnd = Long.parseLong(ranges[1]);
//        } else {
//            rangeEnd = fileLength - 1;
//        }
//
//        if (rangeEnd > fileLength - 1) {
//            rangeEnd = fileLength - 1;
//        }


        System.out.println("range start : " + rangeStart);
        System.out.println("range end : " + rangeEnd);
        InputStream inputStream;

        try {

            inputStream = Files.newInputStream(path);
            inputStream.skip(rangeStart);
            long contentLength = rangeEnd - rangeStart + 1;


            byte[] data = new byte[(int) contentLength];
            int read = inputStream.read(data, 0, data.length);
            System.out.println("read(number of bytes) : " + read);

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Range", "bytes " + rangeStart + "-" + rangeEnd + "/" + fileLength);
            headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
            headers.add("Pragma", "no-cache");
            headers.add("Expires", "0");
            headers.add("X-Content-Type-Options", "nosniff");
            headers.setContentLength(contentLength);

            return ResponseEntity
                    .status(HttpStatus.PARTIAL_CONTENT)
                    .headers(headers)
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(new ByteArrayResource(data));


        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }


    }



 */

    /*
        @GetMapping("/stream/range/{lessionId}")
        public ResponseEntity<Resource> streamVideoRange(
                @PathVariable int lessionId,
                @RequestHeader(value = "Range", required = false) String range,
                HttpServletRequest request) {

            if (range == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }

            Lession lession = lessionService.findLessionById(lessionId);
            Path path = Paths.get(lession.getContentUrl());

            long fileLength = path.toFile().length();
            String[] ranges = range.replace("bytes=", "").split("-");
            long rangeStart = Long.parseLong(ranges[0]);
            long rangeEnd = Math.min(rangeStart + AppConstants.CHUNK_SIZE - 1, fileLength - 1);

            try (InputStream inputStream = Files.newInputStream(path)) {
                inputStream.skip(rangeStart);
                long contentLength = rangeEnd - rangeStart + 1;
                byte[] data = new byte[(int) contentLength];
                inputStream.read(data, 0, data.length);

                // **Track request time**
                String userIp = request.getRemoteAddr(); // Get user IP
                long currentTime = System.currentTimeMillis();

                if (lastRequestTime.containsKey(userIp)) {
                    long lastTime = lastRequestTime.get(userIp);
                    long timeDiff = currentTime - lastTime; // in milliseconds

                    if (timeDiff > 0) {
                        // Get last chunk size
                        long previousChunkSize = lastChunkSize.getOrDefault(userIp, contentLength);

                        // **Estimate watch time** for the last chunk
                        long bitrate = bitrateMap.getOrDefault("720p", 3_000_000L); // Default to 720p
                        double watchTime = (previousChunkSize * 8.0) / bitrate; // in seconds

                        // Convert watch time to milliseconds
                        long watchTimeMillis = (long) (watchTime * 1000);

                        // **Adjust time difference**
                        long adjustedTimeDiff = Math.max(timeDiff - watchTimeMillis, 1); // Ensure non-zero

                        // **Calculate Speed**
                        double speedBytesPerSec = (double) content2wLength / (adjustedTimeDiff / 1000.0);
                        double speedMbps = (speedBytesPerSec * 8) / 1_000_000;

                        System.out.println("User " + userIp + " Speed: " + speedMbps + " Mbps");

                        // **Select video quality dynamically**
                        if (speedMbps < 0.5) {
                            System.out.println("Serving 360p");
                        } else if (speedMbps < 1) {
                            System.out.println("Serving 480p");
                        } else {
                            System.out.println("Serving 720p");
                        }
                    }
                }

                // Store current request time & chunk size
                lastRequestTime.put(userIp, currentTime);
                lastChunkSize.put(userIp, contentLength);

                // Return chunk
                HttpHeaders headers = new HttpHeaders();
                headers.add("Content-Range", "bytes " + rangeStart + "-" + rangeEnd + "/" + fileLength);
                headers.setContentLength(contentLength);

                return ResponseEntity
                        .status(HttpStatus.PARTIAL_CONTENT)
                        .headers(headers)
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .body(new ByteArrayResource(data));
            } catch (IOException ex) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }

        }


     */


}
