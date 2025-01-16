package com.Eshiksha.controllers;

import com.Eshiksha.Entities.ApplicationUser;
import com.Eshiksha.Entities.Student;
import com.Eshiksha.repositories.StudentRepository;
import com.Eshiksha.services.UserDetailsServiceImpl;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
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

    public  AuthController(StudentRepository studentRepository,AuthenticationManager authenticationManager, UserDetailsService userDetailsService,PasswordEncoder passwordEncoder)
    {
        this.studentRepository = studentRepository;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/student/signup")
    public ResponseEntity<?> signup(@RequestBody Student student)
    {
        if(userDetailsService.loadUserByUsername(student.getEmail()) != null)
        {
            return ResponseEntity.badRequest().body("UserName exists!");
        }

        try {
            student.setPassword(passwordEncoder.encode(student.getPassword()));
            this.studentRepository.createStudent(student);
        }catch (Exception e){
            e.printStackTrace();
        }

        return ResponseEntity.ok("Registred succesfully");
    }

}
