package com.Eshiksha.Entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;


@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int studentId;


    @ManyToMany(mappedBy = "enrolledStudents")
    private List<Course> enrolledCourses;

    @OneToMany
    private List<CourseReview> reviews;


    @JoinColumn(name = "user_id") // Links User ID with Student
    @OneToOne(cascade = CascadeType.MERGE)
    private ApplicationUser user;

    @ManyToMany
    private List<Course> bookMarkedCourses;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LessionDoubt> doubts = new ArrayList<>();



    public void setUser(ApplicationUser user) {
        this.user = user;
    }

    public ApplicationUser getUser() {
        return user;
    }


    public List<Course> getEnrolledCourses() {
        return enrolledCourses;
    }

    public void setEnrolledCourses(List<Course> enrolledCourses) {
        this.enrolledCourses = enrolledCourses;
    }

    public List<Course> getBookMarkedCourses() {
        return bookMarkedCourses;
    }

    public void setBookMarkedCourses(List<Course> bookMarkedCourses) {
        this.bookMarkedCourses = bookMarkedCourses;
    }

    public List<LessionDoubt> getDoubts() {
        return doubts;
    }

    public void setDoubts(List<LessionDoubt> doubts) {
        this.doubts = doubts;
    }
}
