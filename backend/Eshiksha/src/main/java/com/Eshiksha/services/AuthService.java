package com.Eshiksha.services;

import com.Eshiksha.Entities.ApplicationUser;
import com.Eshiksha.Entities.Teacher;
import jakarta.mail.MessagingException;

import java.io.UnsupportedEncodingException;

public interface AuthService {


    public void createTeacher(Teacher teacher);

    void sendVerificationEmail(ApplicationUser appUser)
            throws MessagingException, UnsupportedEncodingException;

    ApplicationUser varifyUser(String varificationCode);
}
