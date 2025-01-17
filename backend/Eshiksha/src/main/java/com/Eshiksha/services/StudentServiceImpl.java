package com.Eshiksha.services;

import com.Eshiksha.Entities.ApplicationUser;
import com.Eshiksha.Entities.Role;
import com.Eshiksha.Entities.Student;
import com.Eshiksha.repositories.RoleRepository;
import com.Eshiksha.repositories.RoleRepositoryImpl;
import com.Eshiksha.repositories.StudentRepository;
import com.Eshiksha.repositories.StudentRepositoryImpl;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.apache.commons.lang3.RandomStringUtils;

@Service
public class StudentServiceImpl implements StudentService {
    private StudentRepository studentRepository;
    private RoleRepository roleRepository;

    private JavaMailSender mailSender;

    public StudentServiceImpl(StudentRepository studentRepository, RoleRepository roleRepository,JavaMailSender mailSender) {
        this.studentRepository = studentRepository;
        this.roleRepository = roleRepository;
        this.mailSender = mailSender;
    }


    @Override
    public Student createStudent(Student student) {
        try {
            student.setEnabled(false);
            Set<Role> roles = new HashSet<>();

            Role role = roleRepository.findByName("ROLE_STUDENT").get();
            roles.add(role);

            student.setRoles(roles);

            String varificationCode = UUID.randomUUID().toString();

            System.out.println("Varification code is : " + varificationCode);
            student.setVerificationCode(varificationCode);

            sendVerificationEmail(student);

            return studentRepository.createStudent(student);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }


    private void sendVerificationEmail(Student user)
            throws MessagingException, UnsupportedEncodingException {
        String toAddress = user.getEmail();
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

        content = content.replace("[[name]]", user.getFirstName());
        String verifyURL =  "http://localhost:8000/verify?code=" + user.getVerificationCode();
        content = content.replace("[[URL]]", verifyURL);

        helper.setText(content, true);

        mailSender.send(message);
    }
}
