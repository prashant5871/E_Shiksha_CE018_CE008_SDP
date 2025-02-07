package com.Eshiksha.controllers;

import com.Eshiksha.Entities.Course;
import com.Eshiksha.dto.CourseDTO;
import com.Eshiksha.services.CourseService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {
    private CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping("/")
    public ResponseEntity<?> getAllCourses()
    {
        List<Course> courses =  this.courseService.findAll();
        if(!courses.isEmpty())
        {
            return ResponseEntity.ok(courses);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("there is not have any course!!");
    }

    @PostMapping("/test")
    public String testing()
    {
        return "testing succesfully...";
    }

    @GetMapping("/{id}")
    public Course getById(
            @PathVariable int id
    )
    {
        return this.courseService.findById(id);
    }

    /*
    @PostMapping("/")
    public ResponseEntity<String> createCourse(@RequestBody CourseDTO course, HttpServletRequest request) {
        System.out.println("inisde create method...\n");
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwtToken = authorizationHeader.substring(7);
            System.out.println("JWT Token: " + jwtToken);
            System.out.println("\n " + course);
            this.courseService.create(course.getCourseName(),course.getDescription(),course.getPrice(),course.getCategoryId(),jwtToken,"");

            return ResponseEntity.status(HttpStatus.CREATED).body("Course created succesfully");

        } else {
            System.out.println("Authorization header is missing or invalid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("can not created !");
        }
    }

     */


    @PostMapping("/")
    public ResponseEntity<String> createCourse(@RequestPart("course") String courseJson,
                                               @RequestPart("document") MultipartFile document,
                                               @RequestPart("thumbnail") MultipartFile thumbnail,
                                               HttpServletRequest request) {
        try {
            System.out.println("inside create course method...\n");
            ObjectMapper objectMapper = new ObjectMapper();
            CourseDTO course = objectMapper.readValue(courseJson, CourseDTO.class);

            String authorizationHeader = request.getHeader("Authorization");

            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String jwtToken = authorizationHeader.substring(7);

                // Validate document type
                if (document.isEmpty() || !document.getContentType().equals("application/pdf")) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid document format. Only PDF files are allowed.");
                }

                if(thumbnail.isEmpty())
                {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("thumbnail is not provided");
                }

                try {
                    // Store document in ./documents folder
                    String documentName = System.currentTimeMillis() + "_" + document.getOriginalFilename();
                    Path documentPath = Paths.get("./documents/" + documentName);

                    String thumbnailName = System.currentTimeMillis() + "_" + thumbnail.getOriginalFilename();
                    Path thumbnailPath = Paths.get("./thumbnails/" + thumbnailName);

                    File folder  = new File("./documents");



                    if(!folder.exists()) {
                        Files.createDirectories(documentPath.getParent());
                    }

                    Files.write(documentPath, document.getBytes());
                    Files.write(thumbnailPath, thumbnail.getBytes());

                    String documentUrl = documentPath.toString();
                    String thumbnailUrl = thumbnailPath.toString();

                    // Call service method with updated document URL
                    this.courseService.create(course.getCourseName(), course.getDescription(), course.getPrice(),
                            course.getCategoryId(), jwtToken, documentUrl,thumbnailUrl);

                    return ResponseEntity.status(HttpStatus.CREATED).body("Course created successfully");

                } catch (IOException e) {
                    e.printStackTrace();
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while saving the document.");
                }

            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Authorization header is missing or invalid.");
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }


}
