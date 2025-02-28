package com.Eshiksha.controllers;

import com.Eshiksha.Entities.Course;
import com.Eshiksha.dto.PaymentDTO;
import com.Eshiksha.services.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/student")
public class StudentController {

    private StudentService studentService;

    public StudentController(StudentService studentService)
    {
        this.studentService = studentService;
    }

    @PostMapping("/enroll/{courseId}/{userId}")
    public ResponseEntity<Map<String, String>> enrollStudent(@PathVariable int courseId, @PathVariable int userId,@RequestBody PaymentDTO paymentDTO) {
        Map<String, String> response = new HashMap<>();

        try {
            studentService.enrollStudent(courseId, userId,paymentDTO);
            response.put("message", "Enrollment successful");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Enrollment failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/get-course/{userId}")
    public ResponseEntity<List<Course>> getMyCourses(@PathVariable int userId) throws Exception {
        List<Course> myCourses = studentService.getMyCourses(userId);
//        for(Course course : myCourses)
//        {
//            System.out.println("course Lessions : " + course.getLessions() + "\n");
//        }
        return ResponseEntity.status(HttpStatus.OK).body(myCourses);
    }


}
