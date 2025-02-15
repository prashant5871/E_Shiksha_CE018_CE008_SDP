package com.Eshiksha.controllers;

import com.Eshiksha.Entities.ApplicationUser;
import com.Eshiksha.Entities.Student;
import com.Eshiksha.Entities.Teacher;
import com.Eshiksha.Utils.JwtUtils;
import com.Eshiksha.dto.JwtResponse;
import com.Eshiksha.services.AuthService;
import com.Eshiksha.services.StudentService;
import com.Eshiksha.services.UserDetailsServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final StudentService studentService;
    private final JwtUtils jwtUtils;
    private final AuthService authService;

    public AuthController(StudentService studentService, AuthenticationManager authenticationManager,
                          UserDetailsServiceImpl userDetailsService, PasswordEncoder passwordEncoder,
                          JwtUtils jwtUtils, AuthService authService) {
        this.studentService = studentService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.authService = authService;
    }

    @PostMapping("/student/signup")
    public ResponseEntity<?> signup(@RequestBody Student student) {
        if (userDetailsService.loadUserByUsername(student.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("UserName already exists!", false));
        }

        try {
            student.setPassword(passwordEncoder.encode(student.getPassword()));
            studentService.createStudent(student);
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("Student registered successfully", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Failed to register student", false));
        }
    }

    @PostMapping("/student/login")
    public ResponseEntity<?> loginStudent(@RequestBody Student student) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(student.getUsername(), student.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            return ResponseEntity.ok(new JwtResponse(jwt, student.getUsername(), student.getUserId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse("Invalid username or password!", false));
        }
    }

    @PostMapping("/teacher/login")
    public ResponseEntity<?> loginTeacher(@RequestBody Teacher teacher) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(teacher.getUsername(), teacher.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            return ResponseEntity.ok(new JwtResponse(jwt, teacher.getUsername(), teacher.getUserId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse("Invalid username or password!", false));
        }
    }

    @PostMapping("/verify/{verificationCode}")
    public ResponseEntity<String> verify(@PathVariable String verificationCode) {
        ApplicationUser appUser = this.authService.varifyUser(verificationCode);

        if (appUser != null) {
            return ResponseEntity.ok("Verified successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Verification code is invalid or expired.");
        }
    }

    @PostMapping("/teacher/signup")
    public ResponseEntity<?> signupTeacher(@RequestBody Teacher teacher) {
        if (userDetailsService.loadUserByUsername(teacher.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("UserName already exists!", false));
        }

        try {
            teacher.setPassword(passwordEncoder.encode(teacher.getPassword()));
            authService.createTeacher(teacher);
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("Teacher registered successfully", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Failed to register teacher", false));
        }
    }

    // Helper response structure for consistent API responses
    public static class ApiResponse {
        private String message;
        private boolean success;

        public ApiResponse(String message, boolean success) {
            this.message = message;
            this.success = success;
        }

        public String getMessage() {
            return message;
        }

        public boolean isSuccess() {
            return success;
        }
    }
}
