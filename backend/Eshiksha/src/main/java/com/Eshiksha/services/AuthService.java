package com.Eshiksha.services;

import com.Eshiksha.Entities.ApplicationUser;
import com.Eshiksha.Entities.Teacher;
import jakarta.mail.MessagingException;

import java.io.UnsupportedEncodingException;

public interface AuthService {


//    public void createTeacher(Teacher teacher);

    void createTeacher(ApplicationUser teacher) throws Exception;

    void createStudent(ApplicationUser user) throws Exception;

    void sendVerificationEmail(ApplicationUser appUser)
            throws MessagingException, UnsupportedEncodingException;

    ApplicationUser varifyUser(String varificationCode);

    void sendVerificationEmailFromUserId(int userId) throws Exception;

    boolean isTeacher(ApplicationUser teacher);

    boolean isStudent(ApplicationUser student);

    ApplicationUser getUserByEmailId(String email) throws Exception;
}
