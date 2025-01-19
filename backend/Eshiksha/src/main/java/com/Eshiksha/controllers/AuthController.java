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

    private StudentService studentService;


    private final JwtUtils jwtUtils;

    private AuthService authService;

    public AuthController(StudentService studentService, AuthenticationManager authenticationManager, UserDetailsServiceImpl userDetailsService, PasswordEncoder passwordEncoder, JwtUtils jwtUtils, AuthService authService) {
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
            return ResponseEntity.badRequest().body("UserName exists!");
        }

        try {
            student.setPassword(passwordEncoder.encode(student.getPassword()));
            this.studentService.createStudent(student);
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

    @PostMapping("/teacher/login")
    public ResponseEntity<?> loginTeacher(@RequestBody Teacher teacher) {
        try {
            System.out.println("student email : " + teacher.getEmail() + '\n');
            System.out.println("teacher password : " + teacher.getPassword() + '\n');
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(teacher.getUsername(), teacher.getPassword()));
            System.out.println("After authenticate method\n");
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            return ResponseEntity.ok(new JwtResponse(jwt, teacher.getUsername()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password!");
        }

    }
    @PostMapping("/varify/{varificationCode}")
    public ResponseEntity<String> varify(
            @PathVariable String varificationCode
    )
    {
        ApplicationUser appUser = this.authService.varifyUser(varificationCode);

        if(appUser != null)
        {
            return ResponseEntity.ok("varified succesfully");
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/teacher/signup")
    public ResponseEntity<?> signupTeacher(@RequestBody Teacher teacher) {
        if (userDetailsService.loadUserByUsername(teacher.getEmail()) != null) {
            return ResponseEntity.badRequest().body("UserName exists!");
        }

        try {
            teacher.setPassword(passwordEncoder.encode(teacher.getPassword()));
            this.authService.createTeacher(teacher);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok("Registred succesfully");
    }

}
