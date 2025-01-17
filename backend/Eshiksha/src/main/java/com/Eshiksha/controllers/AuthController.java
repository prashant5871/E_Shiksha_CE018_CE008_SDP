package com.Eshiksha.controllers;

import com.Eshiksha.Entities.ApplicationUser;
import com.Eshiksha.Entities.Student;
import com.Eshiksha.Utils.JwtUtils;
import com.Eshiksha.dto.JwtResponse;
import com.Eshiksha.repositories.StudentRepository;
import com.Eshiksha.services.UserDetailsServiceImpl;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;

    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;

    private StudentRepository studentRepository;

    private final JwtUtils jwtUtils;

    public AuthController(StudentRepository studentRepository, AuthenticationManager authenticationManager, UserDetailsService userDetailsService, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.studentRepository = studentRepository;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/student/signup")
    public ResponseEntity<?> signup(@RequestBody Student student) {
        if (userDetailsService.loadUserByUsername(student.getEmail()) != null) {
            return ResponseEntity.badRequest().body("UserName exists!");
        }

        try {
            student.setPassword(passwordEncoder.encode(student.getPassword()));
            this.studentRepository.createStudent(student);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok("Registred succesfully");
    }

    @PostMapping("/student/login")
    public ResponseEntity<?> loginStudent(@RequestBody Student student) {
        try {
            System.out.println("student email : " + student.getEmail() + '\n');
            System.out.println("student password : " + student.getPassword() + '\n');
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(student.getUsername(), student.getPassword()));
            System.out.println("After authenticate method\n");
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            return ResponseEntity.ok(new JwtResponse(jwt, student.getUsername()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password!");
        }

    }

}
