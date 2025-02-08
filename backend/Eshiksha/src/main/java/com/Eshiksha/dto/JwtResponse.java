package com.Eshiksha.dto;


public class JwtResponse {
    private String token;
    private String username;

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public JwtResponse(String token, String username, int userId) {
        this.token = token;
        this.username = username;
        this.userId = userId;
    }

    private int userId;
    public JwtResponse() {
        super();
        // TODO Auto-generated constructor stub
    }
    public JwtResponse(String token, String username) {
        super();
        this.token = token;
        this.username = username;
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


}