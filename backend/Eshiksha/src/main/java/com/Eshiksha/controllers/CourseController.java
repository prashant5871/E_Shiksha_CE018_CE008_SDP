package com.Eshiksha.controllers;

import com.Eshiksha.Entities.Course;
import com.Eshiksha.services.CourseService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {
    private CourseService courseController;

    public CourseController(CourseService courseController) {
        this.courseController = courseController;
    }

    @GetMapping("/")
    public List<Course> getAllCourses()
    {
        return this.courseController.findAll();
    }
}
