package com.Eshiksha.services;

import com.Eshiksha.Entities.ApplicationUser;
import com.Eshiksha.Entities.Role;
import com.Eshiksha.Entities.Student;
import com.Eshiksha.Entities.Teacher;
import com.Eshiksha.controllers.AuthController;
import com.Eshiksha.repositories.RoleRepository;
import com.Eshiksha.repositories.StudentRepository;
import com.Eshiksha.repositories.TeacherRepository;
import com.Eshiksha.repositories.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {
    private TeacherRepository teacherRepository;
    private JavaMailSender mailSender;
    private RoleRepository roleRepository;
    private UserRepository userRepository;

    private StudentRepository studentRepository;

    private StudentService studentService;

    private PasswordEncoder passwordEncoder;

    private TeacherService teacherService;

    public AuthServiceImpl(TeacherRepository teacherRepository, JavaMailSender mailSender, RoleRepository roleRepository, UserRepository userRepository, StudentRepository studentRepository, StudentService studentService, PasswordEncoder passwordEncoder, TeacherService teacherService) {
        this.passwordEncoder = passwordEncoder;
        this.studentService = studentService;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.mailSender = mailSender;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.teacherService = teacherService;

    }

    @Override
    public void createTeacher(ApplicationUser teacher) throws Exception {

        try {
            System.out.println("Inside signup method");
            Optional<ApplicationUser> existingUser = userRepository.findByEmail(teacher.getEmail());

            if (existingUser.isPresent()) {
                System.out.println("inside ispresent method");
                ApplicationUser user = existingUser.get();
                Optional<Teacher> existingTeacher = teacherRepository.findByUser(user);
                System.out.println("After findByUser");
                if (existingTeacher.isPresent()) {
                    throw new Exception("teacher with this email already exists!");
                }


                Role studentRole = roleRepository.findByName("ROLE_TEACHER")
                        .orElseThrow(() -> new RuntimeException("Role not found"));
                user.getRoles().add(studentRole);

                userRepository.save(user);

                teacherService.createTeacherFromUser(user);

                sendVerificationEmail(user);


            } else {
                teacher.setPassword(passwordEncoder.encode(teacher.getPassword()));
                Role teacherRole = roleRepository.findByName("ROLE_TEACHER")
                        .orElseThrow(() -> new RuntimeException("Role not found"));
                teacher.getRoles().add(teacherRole);
                teacherService.createTeacher(teacher);
                sendVerificationEmail(teacher);
            }
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public void createStudent(ApplicationUser student) throws Exception {
        try {
            System.out.println("Inside signup method");
            Optional<ApplicationUser> existingUser = userRepository.findByEmail(student.getEmail());

            if (existingUser.isPresent()) {
                System.out.println("inside ispresent method");
                ApplicationUser user = existingUser.get();
                Optional<Student> existingStudent = studentRepository.findByUser(user);
                System.out.println("After findByUser");
                if (existingStudent.isPresent()) {
                    throw new Exception("Student with this email already exists!");
                }

                System.out.println("User is an instance of teacher");

                Role studentRole = roleRepository.findByName("ROLE_STUDENT")
                        .orElseThrow(() -> new RuntimeException("Role not found"));
                user.getRoles().add(studentRole);

                userRepository.save(user);

                studentService.createStudentFromUser(user);

                sendVerificationEmail(user);


            } else {
                student.setPassword(passwordEncoder.encode(student.getPassword()));
                Role studentRole = roleRepository.findByName("ROLE_STUDENT")
                        .orElseThrow(() -> new RuntimeException("Role not found"));
                student.getRoles().add(studentRole);
                studentService.createStudent(student);
                sendVerificationEmail(student);
            }
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }


    @Override
    public void sendVerificationEmail(ApplicationUser appUser)
            throws MessagingException, UnsupportedEncodingException {
        String toAddress = appUser.getEmail();
        String fromAddress = "prashantkalsariya001@gmail.com";
        String senderName = "EShiksha";
        String subject = "Please verify your registration";
        String content = "Dear [[name]],<br>"
                + "Please click the link below to verify your registration:<br>"
                + "<h3><a href=\"[[URL]]\" target=\"_self\">VERIFY</a></h3>"
                + "Thank you,<br>"
                + "EShiksha.";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);

        content = content.replace("[[name]]", appUser.getFirstName());
        String verifyURL = "http://localhost:3000/verify?code=" + appUser.getVerificationCode();
        content = content.replace("[[URL]]", verifyURL);

        helper.setText(content, true);

        mailSender.send(message);
    }

    @Override
    public ApplicationUser varifyUser(String varificationCode) {
        ApplicationUser appUser = userRepository.findByVarificationCode(varificationCode).get();

        if (appUser != null) {
            appUser.setEnabled(true);
        }

        userRepository.save(appUser);

        return appUser;

    }

    @Override
    public void sendVerificationEmailFromUserId(int userId) throws Exception {
        try {
            ApplicationUser user = userRepository.findByUserId(userId).orElseThrow(() -> new Exception("no user found"));
            sendVerificationEmail(user);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public boolean isTeacher(ApplicationUser teacher) {
        return teacherRepository.findByUser(userRepository.findByEmail(teacher.getEmail()).get()).isPresent();
    }

    @Override
    public boolean isStudent(ApplicationUser student) {
        return studentRepository.findByUser(userRepository.findByEmail(student.getEmail()).get()).isPresent();
    }

    @Override
    public ApplicationUser getUserByEmailId(String email) throws Exception {
        return userRepository.findByEmail(email).orElseThrow(()-> new Exception("not found user with given email"));
    }
}
