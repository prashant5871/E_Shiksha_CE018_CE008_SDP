package com.Eshiksha.services;

import com.Eshiksha.Entities.ApplicationUser;
import com.Eshiksha.Entities.Role;
import com.Eshiksha.Entities.Student;
import com.Eshiksha.repositories.*;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
public class StudentServiceImpl implements StudentService {
    private StudentRepository studentRepository;
    private RoleRepository roleRepository;

    private UserRepository userRepository;

    private JavaMailSender mailSender;

    public StudentServiceImpl(StudentRepository studentRepository, RoleRepository roleRepository,JavaMailSender mailSender,UserRepository userRepository) {
        this.studentRepository = studentRepository;
        this.roleRepository = roleRepository;
        this.mailSender = mailSender;
        this.userRepository = userRepository;
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

            return studentRepository.save(student);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public ApplicationUser findByVarificationCode(String varificationCode) {
        ApplicationUser appUser = studentRepository.findByVarificationCode(varificationCode).get();

        return appUser;

    }

    @Override
    public ApplicationUser findByUserName(String username) {
        return this.userRepository.findByEmail(username).get();
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
        String verifyURL =  "http://localhost:3000/verify?code=" + user.getVerificationCode();
        content = content.replace("[[URL]]", verifyURL);

        helper.setText(content, true);

        mailSender.send(message);
    }
}
