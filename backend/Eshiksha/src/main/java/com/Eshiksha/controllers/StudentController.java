package com.Eshiksha.controllers;

import com.Eshiksha.Entities.Course;
import com.Eshiksha.dto.PaymentDTO;
import com.Eshiksha.repositories.CourseRepository;
import com.Eshiksha.services.StudentService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
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

    private CourseRepository courseRepository;

    @Value("${stripe.secret.key}")
    private String secretKey;

    public StudentController(StudentService studentService, CourseRepository courseRepository)
    {
        this.studentService = studentService;
        this.courseRepository = courseRepository;
    }

//    @PostMapping("/enroll/{courseId}/{userId}")
//    public ResponseEntity<Map<String, String>> enrollStudent(@PathVariable int courseId, @PathVariable int userId,@RequestBody PaymentDTO paymentDTO) {
//        Map<String, String> response = new HashMap<>();
//
//        try {
//            studentService.enrollStudent(courseId, userId,paymentDTO);
//            response.put("message", "Enrollment successful");
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            response.put("message", "Enrollment failed: " + e.getMessage());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
//        }
//    }

    @PostMapping("/enroll-free/{courseId}/{userId}")
    public ResponseEntity<?> enrollForFree(
            @PathVariable int courseId,
            @PathVariable int userId
    ){
        Map<String, String> response = new HashMap<>();
        try {
            studentService.enrollStudentForFree(courseId,userId);
            response.put("message","Enrolled succesfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    @PostMapping("/enroll/{courseId}/{userId}")
    public ResponseEntity<Map<String, String>> enrollStudent(
            @PathVariable int courseId,
            @PathVariable int userId,
            @RequestBody PaymentDTO paymentDTO) {

        Map<String, String> response = new HashMap<>();

        try {
            // 1️⃣ Setup Stripe API Key (Use your Secret Key here)
            Stripe.apiKey = secretKey; // Replace with your Stripe Secret Key
//            Course course = courseRepository
            // 2️⃣ Create a PaymentIntent with the amount and currency
            Course course = courseRepository.findById(courseId).orElseThrow();
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount((long) (course.getPrice() * 100)) // Convert INR to paise
                    .setCurrency("INR")
                    .setPaymentMethod(paymentDTO.getPaymentMethodId()) // Attach Payment Method
                    .setConfirm(true) // Confirm Payment Immediately
                    .build();



            PaymentIntent paymentIntent = PaymentIntent.create(params);

            // 3️⃣ Check Payment Status
            if (!"succeeded".equals(paymentIntent.getStatus())) {
                response.put("message", "Payment failed: " + paymentIntent.getStatus());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // 4️⃣ If payment is successful, enroll the student
            studentService.enrollStudent(courseId, userId, paymentDTO);

            response.put("message", "Enrollment successful. Payment ID: " + paymentIntent.getId());
            return ResponseEntity.ok(response);

        } catch (StripeException e) {
            response.put("message", "Payment failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
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
