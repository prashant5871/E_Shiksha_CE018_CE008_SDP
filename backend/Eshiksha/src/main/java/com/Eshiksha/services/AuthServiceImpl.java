package com.Eshiksha.services;

import com.Eshiksha.Entities.ApplicationUser;
import com.Eshiksha.Entities.Role;
import com.Eshiksha.Entities.Teacher;
import com.Eshiksha.repositories.RoleRepository;
import com.Eshiksha.repositories.TeacherRepository;
import com.Eshiksha.repositories.UserRepository;
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
public class AuthServiceImpl implements AuthService {
    private TeacherRepository teacherRepository;
    private JavaMailSender mailSender;
    private RoleRepository roleRepository;
    private UserRepository userRepository;


    public AuthServiceImpl(TeacherRepository teacherRepository, JavaMailSender mailSender, RoleRepository roleRepository, UserRepository userRepository) {
        this.teacherRepository = teacherRepository;
        this.mailSender = mailSender;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void createTeacher(Teacher teacher) {
        try {
            Set<Role> roles = new HashSet<>();

            Role role = roleRepository.findByName("ROLE_TEACHER").get();
            roles.add(role);

            teacher.setRoles(roles);

            String varificationCode = UUID.randomUUID().toString();

            System.out.println("Varification code is : " + varificationCode);
            teacher.setVerificationCode(varificationCode);
            teacher.setEnabled(false);
            teacherRepository.save(teacher);
            sendVerificationEmail(teacher);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
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
        String verifyURL =  "http://localhost:3000/verify?code=" + appUser.getVerificationCode();
        content = content.replace("[[URL]]", verifyURL);

        helper.setText(content, true);

        mailSender.send(message);
    }

    @Override
    public ApplicationUser varifyUser(String varificationCode) {
        ApplicationUser appUser = userRepository.findByVarificationCode(varificationCode).get();

        if(appUser != null)
        {
            appUser.setEnabled(true);
        }

        userRepository.save(appUser);

        return appUser;

    }
}
