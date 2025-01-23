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
                                               @RequestPart("file") MultipartFile file,
                                               HttpServletRequest request) {
        try {
            System.out.println("inside create course method...\n");
            ObjectMapper objectMapper = new ObjectMapper();
            CourseDTO course = objectMapper.readValue(courseJson, CourseDTO.class);

            String authorizationHeader = request.getHeader("Authorization");

            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String jwtToken = authorizationHeader.substring(7);

                // Validate file type
                if (file.isEmpty() || !file.getContentType().equals("application/pdf")) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid file format. Only PDF files are allowed.");
                }

                try {
                    // Store file in ./documents folder
                    String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                    Path filePath = Paths.get("./documents/" + fileName);

                    File folder  = new File("./documents");



                    if(!folder.exists()) {
                        Files.createDirectories(filePath.getParent());
                    }

                    Files.write(filePath, file.getBytes());

                    String documentUrl = filePath.toString();

                    // Call service method with updated document URL
                    this.courseService.create(course.getCourseName(), course.getDescription(), course.getPrice(),
                            course.getCategoryId(), jwtToken, documentUrl);

                    return ResponseEntity.status(HttpStatus.CREATED).body("Course created successfully");

                } catch (IOException e) {
                    e.printStackTrace();
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while saving the file.");
                }

            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Authorization header is missing or invalid.");
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }


}
