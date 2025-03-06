package com.Eshiksha.dto;


import com.Eshiksha.Entities.Student;

public class JwtResponse {
    private String token;
    private String username;
    private int userId;

    private Student user;

    private boolean isEnabled;


    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public JwtResponse(String token, String username, int userId, Student user, boolean isEnabled) {
        this.token = token;
        this.username = username;
        this.userId = userId;
        this.user = user;
        this.isEnabled = isEnabled;
    }



    public JwtResponse() {
        super();
        // TODO Auto-generated constructor stub
    }

    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    public Student getStudent() {
        return user;
    }

    public void setStudent(Student user) {
        this.user = user;
    }

    public boolean isEnabled() {
        return isEnabled;
    }

    public void setEnabled(boolean enabled) {
        isEnabled = enabled;
    }
}