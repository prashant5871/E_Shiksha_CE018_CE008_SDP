package com.Eshiksha.controllers;

import com.Eshiksha.Entities.Course;
import com.Eshiksha.Entities.Lession;
import com.Eshiksha.services.CourseService;
import com.Eshiksha.services.LessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/lessions")
public class LessionController {

    @Autowired
    private LessionService lessionService;

    @Autowired
    private CourseService courseService;

    private static final String VIDEO_DIRECTORY = "./video";

    @PostMapping("/{courseId}")
    public ResponseEntity<String> createLession(@PathVariable int courseId,
                                                @RequestParam("title") String title,
                                                @RequestParam("description") String description,
                                                @RequestParam("duration") long durationInSeconds,
                                                @RequestParam("sequenceNumber") int sequenceNumber,
                                                @RequestParam("resources") String resources,
                                                @RequestParam("status") String status,
                                                @RequestParam("video") MultipartFile videoFile) {
        try {
            // Validate course existence
            System.out.println("inside controller\n");
            Course course = courseService.getCourseById(courseId);
            if (course == null) {
                return ResponseEntity.badRequest().body("Course not found with ID: " + courseId);
            }

            // Save video file to local file system
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
            return ResponseEntity.status(500).body("Error saving video file: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred: " + e.getMessage());
        }
    }
}
