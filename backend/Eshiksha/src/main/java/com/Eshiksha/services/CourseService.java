package com.Eshiksha.services;

import com.Eshiksha.Entities.Course;
import com.Eshiksha.Entities.CourseCategory;

import java.util.List;

public interface CourseService {
    public List<Course> findAll();

    public Course findById(int id);

    public void create(String courseName, String description, float price, int categoryId, String jwtToken, String documentUrl, String thumbnailUrl, String demoVideoUrl, int duration) throws Exception;

    public Course getCourseById(int courseId);

    boolean bookMarkCourse(int courseId, int userId);
    public void changeStatus(int id, String status);

    void saveCourse(Course course);

    boolean removeFromBookMark(int courseId, int userId);

    List<CourseCategory> findAllCategories();
}
