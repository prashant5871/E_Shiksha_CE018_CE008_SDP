package com.Eshiksha.controllers;

import com.Eshiksha.Entities.ApplicationUser;
import com.Eshiksha.Entities.Role;
import com.Eshiksha.Entities.Student;
import com.Eshiksha.Entities.Teacher;
import com.Eshiksha.Utils.JwtUtils;
import com.Eshiksha.dto.JwtResponse;
import com.Eshiksha.repositories.RoleRepository;
import com.Eshiksha.repositories.StudentRepository;
import com.Eshiksha.repositories.TeacherRepository;
import com.Eshiksha.repositories.UserRepository;
import com.Eshiksha.services.AuthService;
import com.Eshiksha.services.StudentService;
import com.Eshiksha.services.UserDetailsServiceImpl;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;

    private final JwtUtils jwtUtils;
    private final AuthService authService;


    public AuthController(AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder,
                          JwtUtils jwtUtils, AuthService authService, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.authService = authService;
    }

    @PostMapping("/student/signup")
    public ResponseEntity<?> signup(@RequestBody ApplicationUser student) {
        try {

            authService.createStudent(student);

            return ResponseEntity.status((HttpStatus.CREATED)).body(new AuthController.ApiResponse("registred succsefully", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AuthController.ApiResponse(e.getMessage(), false));
        }
    }


    @PostMapping("/student/login")
    public ResponseEntity<?> loginStudent(@RequestBody ApplicationUser student) {
        try {
            if (!authService.isStudent(student)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse("Invalid username or password!", false));

            }
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(student.getUsername(), student.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            ApplicationUser user = authService.getUserByEmailId(student.getEmail());

            return ResponseEntity.ok(new JwtResponse(jwt, student.getUsername(), user.getUserId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse("Invalid username or password!", false));
        }
    }

    @PostMapping("/teacher/login")
    public ResponseEntity<?> loginTeacher(@RequestBody ApplicationUser teacher) {
        try {
            if (!authService.isTeacher(teacher)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse("Invalid username or password!(first)", false));

            }
            System.out.println("before authenticate method\n");
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(teacher.getUsername(), teacher.getPassword()));
            System.out.println("After authenticate method\n");
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            ApplicationUser user = authService.getUserByEmailId(teacher.getEmail());
            return ResponseEntity.ok(new JwtResponse(jwt, teacher.getUsername(), user.getUserId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse("Invalid username or password!(second)", false));
        }
    }

    @PostMapping("/varify/{verificationCode}")
    public ResponseEntity<String> verify(@PathVariable String verificationCode) {
        ApplicationUser appUser = this.authService.varifyUser(verificationCode);

        if (appUser != null) {
            return ResponseEntity.ok("Verified successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Verification code is invalid or expired.");
        }
    }

    @PostMapping("/send-varification-code/{userId}")
    public ResponseEntity<?> sendVarificationCode(@PathVariable int userId) {
        try {
            authService.sendVerificationEmailFromUserId(userId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(new ApiResponse("Varification email sent succesfully...", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), true));
        }
    }

    @PostMapping("/teacher/signup")
    public ResponseEntity<?> signupTeacher(@RequestBody ApplicationUser teacher) {

        try {
            authService.createTeacher(teacher);
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("Teacher registered successfully", true));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(e.getMessage(), false));
        }
    }

    //............sali karelo area............
    @PostMapping("/admin")
    public ResponseEntity<?> adminLogin(@RequestBody ApplicationUser admin){
        try{
            if (!("k_dev".equals(admin.getUsername()) && "123456".equals(admin.getPassword())) &&
                    !("p_dev".equals(admin.getUsername()) && "123456".equals(admin.getPassword()))) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse("Invalid username or password!", false));
            }
//            System.out.println("hale to che");
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(admin.getUsername(), admin.getPassword()));
//            System.out.println("manager hale che");
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
//            System.out.println("token ave che"+jwt);
            return ResponseEntity.ok(new JwtResponse(jwt, admin.getUsername(), -1));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse("Invalid username or password!", false));
        }
    }
    //.......................................end

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
