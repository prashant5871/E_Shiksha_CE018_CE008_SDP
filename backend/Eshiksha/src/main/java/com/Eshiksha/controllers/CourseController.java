package com.Eshiksha.controllers;

import com.Eshiksha.Entities.Course;
import com.Eshiksha.dto.CourseDTO;
import com.Eshiksha.services.CourseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {
    private CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping("/")
    public List<Course> getAllCourses()
    {
        return this.courseService.findAll();
    }

    @GetMapping("/{id}")
    public Course getById(
            @PathVariable int id
    )
    {
        return this.courseService.findById(id);
    }

    @PostMapping("/")
    public ResponseEntity<String> createCourse(@RequestBody CourseDTO course, HttpServletRequest request) {

        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwtToken = authorizationHeader.substring(7);
            System.out.println("JWT Token: " + jwtToken);
            System.out.println("\n " + course);
            this.courseService.create(course.getCourseName(),course.getDescription(),course.getPrice(),course.getCategoryId(),jwtToken);

            return ResponseEntity.status(HttpStatus.CREATED).body("Course created succesfully");

        } else {
            System.out.println("Authorization header is missing or invalid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("can not created !");
        }
    }
}
