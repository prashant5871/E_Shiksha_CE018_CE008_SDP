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
import org.apache.tomcat.util.http.parser.Authorization;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

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
            Student s1 = authService.findStudentByUser(student);
            return ResponseEntity.ok(new JwtResponse(jwt, student.getUsername(), user.getUserId(), s1, user.isEnabled()));
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
            Teacher s1 = authService.findTeacherByUser(teacher);
            return ResponseEntity.ok(new JwtResponse(jwt, teacher.getUsername(), user.getUserId(), null, user.isEnabled()));
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

    @PostMapping("/send-varification-code/{email}")
    public ResponseEntity<?> sendVarificationCode(@PathVariable String email) {
        try {
            authService.sendVerificationEmailFromUserId(email);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(new ApiResponse("Varification email sent succesfully", true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), false));
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
    public ResponseEntity<?> adminLogin(@RequestBody ApplicationUser admin) {
        try {
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
            return ResponseEntity.ok(new JwtResponse(jwt, admin.getUsername(), -1, null, true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse("Invalid username or password!", false));
        }
    }
    //.......................................end

    @GetMapping("/jwt-varify")
    public ResponseEntity<Map<String, Object>> varifyToken(@RequestHeader("Authorization") String authHeader) {
        System.out.println("varifying jwt token");
        Map<String, Object> response = new HashMap<>();
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("authHead is either null or not starts with Bearer : " + authHeader);
            response.put("isValid", false);

            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        System.out.println("authheader is of required type");
        String token = authHeader.substring(7);
        System.out.println("this is the token : " + token);
        boolean valid = authService.varifyToken(token);
        System.out.println("After varify token gets executes");
        response.put("isValid", valid);

        ApplicationUser userByToken = authService.findUserByToken(token);

        boolean isStudent = authService.isStudent(userByToken);
        response.put("isStudent", isStudent);
        if (isStudent)
            response.put("user", authService.findStudentByUser(userByToken));
        else {
            response.put("users", authService.findTeacherByUser(userByToken));
        }
        return ResponseEntity.status(HttpStatus.OK).body(response);


    }

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
