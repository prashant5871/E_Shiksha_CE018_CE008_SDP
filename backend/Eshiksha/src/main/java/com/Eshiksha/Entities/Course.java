package com.Eshiksha.Entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int courseId;

    private String courseName;

    private String description;

    private float price;


    @ManyToOne
    private CourseCategory category;

    @OneToMany
    List<Lession> lessions;

    @ManyToOne
    private Teacher teacher;

    @ManyToMany
    @JoinTable(
            name = "enrolled_students",
            joinColumns = @JoinColumn(name = "courseId"),
            inverseJoinColumns = @JoinColumn(name = "studetnId")
    )
    private List<Student> enrolledStudents;

    @OneToMany(cascade = CascadeType.ALL,mappedBy = "course")
    private List<CourseReview> reviews;

    private String status;

    private String documentUrl;

    private String thumbnail;

    private int duration; //in days

    public String getDemoVideo() {
        return demoVideo;
    }


    public void setDemoVideo(String demoVideo) {
        this.demoVideo = demoVideo;
    }

    public Course(int courseId, String courseName, String description, float price, CourseCategory category, List<Lession> lessions, Teacher teacher, List<Student> enrolledStudents, List<CourseReview> reviews, String status, String documentUrl, String thumbnail, String demoVideo) {
        this.courseId = courseId;
        this.courseName = courseName;
        this.description = description;
        this.price = price;
        this.category = category;
        this.lessions = lessions;
        this.teacher = teacher;
        this.enrolledStudents = enrolledStudents;
        this.reviews = reviews;
        this.status = status;
        this.documentUrl = documentUrl;
        this.thumbnail = thumbnail;
        this.demoVideo = demoVideo;
    }

    private String demoVideo;


    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }


    public Course() {

    }


    public Course(String courseName, String description, float price) {
        this.courseName = courseName;
        this.description = description;
        this.price = price;
    }

    public int getCourseId() {
        return courseId;
    }

    public void setCourseId(int courseId) {
        this.courseId = courseId;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public CourseCategory getCategory() {
        return category;
    }

    public void setCategory(CourseCategory category) {
        this.category = category;
    }

    public List<Lession> getLessions() {
        return lessions;
    }

    public void setLessions(List<Lession> lessions) {
        this.lessions = lessions;
    }

    public Teacher getTeacher() {
        return teacher;
    }

    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }

    public List<Student> getEnrolledStudents() {
        return enrolledStudents;
    }

    public void setEnrolledStudents(List<Student> enrolledStudents) {
        this.enrolledStudents = enrolledStudents;
    }

    public List<CourseReview> getReviews() {
        return reviews;
    }

    public void setReviews(List<CourseReview> reviews) {
        this.reviews = reviews;
    }

    @Override
    public String toString() {
        return "Course{" +
                "courseId=" + courseId +
                ", courseName=" + courseName +
                ", description='" + description + '\'' +
                ", price=" + price +
                ", category=" + category +
                ", lessions=" + lessions +
                ", teacher=" + teacher +
                ", enrolledStudents=" + enrolledStudents +
                ", reviews=" + reviews +
                '}';
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDocumentUrl() {
        return documentUrl;
    }

    public void setDocumentUrl(String documentUrl) {
        this.documentUrl = documentUrl;
    }
}
