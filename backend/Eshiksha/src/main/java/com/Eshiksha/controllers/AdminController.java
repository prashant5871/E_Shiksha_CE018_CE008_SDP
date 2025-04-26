package com.Eshiksha.controllers;

import com.Eshiksha.Entities.Course;
import com.Eshiksha.Entities.Teacher;
import com.Eshiksha.services.AuthService;
import com.Eshiksha.services.AuthServiceImpl;
import com.Eshiksha.services.CourseService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private CourseService courseService;
    private AuthService authService;

    AdminController(CourseService cs, AuthService as){
        courseService = cs;
        authService = as;
    }

    @PostMapping("/{id}/{status}")
    public ResponseEntity<?> changeStatus(@PathVariable int id, @PathVariable String status, @RequestBody String body){
        Map<String, Object> response = new HashMap<>();
        ObjectMapper objectMapper = new ObjectMapper();
        try{
            Map<String, String> requestBody = objectMapper.readValue(body, Map.class);
            String description = requestBody.get("description");
            courseService.changeStatus(id, status);
            System.out.println("status is update.....");
            Course course = courseService.getCourseById(id);
            authService.sendCourseStatusEmail(course.getTeacher().getUser(), course.getCourseName(),status, description);
            System.out.println("mail is gone...........");
            response.put("message", "Status Changed Successfully and Notification sent to " + course.getTeacher().getUser().getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Unable to change Status");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}
