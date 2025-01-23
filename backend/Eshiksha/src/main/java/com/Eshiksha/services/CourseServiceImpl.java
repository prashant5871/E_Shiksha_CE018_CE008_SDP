package com.Eshiksha.services;

import com.Eshiksha.Entities.ApplicationUser;
import com.Eshiksha.Entities.Course;
import com.Eshiksha.Entities.CourseCategory;
import com.Eshiksha.Entities.Teacher;
import com.Eshiksha.Utils.JwtUtils;
import com.Eshiksha.repositories.CourseCategoryRepository;
import com.Eshiksha.repositories.CourseRepository;
import com.Eshiksha.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseServiceImpl implements CourseService {
    private CourseRepository courseRepository;
    private CourseCategoryRepository courseCategoryRepository;

    private JwtUtils jwtUtils;
    private UserRepository userRepository;
    public CourseServiceImpl(CourseRepository courseRepository, CourseCategoryRepository courseCategoryRepository, JwtUtils jwtUtils, UserRepository userRepository) {
        this.courseRepository = courseRepository;
        this.courseCategoryRepository = courseCategoryRepository;
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
    }

    @Override
    public List<Course> findAll() {
        return courseRepository.findAll();
    }

    @Override
    public Course findById(int id) {
        return this.courseRepository.findById(id).orElseThrow(() -> new RuntimeException("course doesn't exists!"));
    }

    @Override
    public void create(String courseName, String description, float price, int categoryId, String jwtToken, String documentUrl) {
        Course course = new Course(courseName,description,price);

        CourseCategory category = this.courseCategoryRepository.findById(categoryId).orElseThrow(()->new RuntimeException("Invalid Course Category"));

        course.setCategory(category);

        course.setStatus("PENDING");

        String usernameFromToken = this.jwtUtils.getUsernameFromToken(jwtToken);

        System.out.println(usernameFromToken);

        ApplicationUser user = this.userRepository.findByEmail(usernameFromToken).orElseThrow(()->new RuntimeException("user not found!"));


        Teacher teacher = new Teacher(user);

        course.setTeacher(teacher);
        course.setDocumentUrl(documentUrl);
        System.out.println("Teacher = " + teacher.getUserId());


        this.courseRepository.save(course);


    }

    @Override
    public Course getCourseById(int courseId) {
        return courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));
    }
}
