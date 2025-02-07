package com.Eshiksha.controllers;

import com.Eshiksha.AppConstants;
import com.Eshiksha.Entities.Course;
import com.Eshiksha.Entities.Lession;
import com.Eshiksha.services.CourseService;
import com.Eshiksha.services.LessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
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

    private static final String VIDEO_DIRECTORY = "./lession";

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



    @GetMapping("/stream/{lessionId}")
    public ResponseEntity<Resource> stream(@PathVariable int lessionId) {

        System.out.println("Request come for the id  : " + lessionId);

        Lession lession = lessionService.findLessionById(lessionId);
        if(lession != null)
        {
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



}
