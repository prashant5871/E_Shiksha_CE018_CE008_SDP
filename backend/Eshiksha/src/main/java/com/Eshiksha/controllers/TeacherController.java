package com.Eshiksha.controllers;

import com.Eshiksha.Entities.Course;
import com.Eshiksha.services.TeacherService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/teacher")
public class TeacherController {
    private TeacherService teacherService;

    public TeacherController(TeacherService teacherService)
    {
        this.teacherService = teacherService;
    }

    @GetMapping("/courses")
    public ResponseEntity<?> getAllCourses(HttpServletRequest request)
    {

        try{
            String authorizationHeader = request.getHeader("Authorization");
            String jwtToken = authorizationHeader.substring(7);

            List<Course> courses =  this.teacherService.getOwnCourses(jwtToken);
            return ResponseEntity.ok(courses);
        }catch(Exception e)
        {
            Map<String ,String > res = new HashMap<>();
            res.put("message","there is an error , please try again later");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
        }
    }


}
