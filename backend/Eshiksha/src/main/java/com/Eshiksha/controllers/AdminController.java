package com.Eshiksha.controllers;

import com.Eshiksha.services.CourseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private CourseService courseService;

    AdminController(CourseService cs){
        courseService = cs;
    }

    @GetMapping("/{id}/{status}")
    public ResponseEntity<?> changeStatus(@PathVariable int id, @PathVariable String status){
        Map<String, Object> response = new HashMap<>();
        try{
            courseService.changeStatus(id, status);
            response.put("message", "Status Changed Successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("message", "Unable to change Status");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}
