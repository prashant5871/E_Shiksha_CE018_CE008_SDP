package com.Eshiksha.services;

import com.Eshiksha.Entities.*;
import com.Eshiksha.Utils.JwtUtils;
import com.Eshiksha.repositories.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseServiceImpl implements CourseService {
    private CourseRepository courseRepository;
    private CourseCategoryRepository courseCategoryRepository;

    private JwtUtils jwtUtils;
    private UserRepository userRepository;
    private TeacherRepository teacherRepository;

    private StudentRepository studentRepository;

    public CourseServiceImpl(CourseRepository courseRepository, CourseCategoryRepository courseCategoryRepository, JwtUtils jwtUtils, UserRepository userRepository, TeacherRepository teacherRepository, StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
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
    public void create(String courseName, String description, float price, int categoryId, String jwtToken, String documentUrl, String thumbnailUrl, String demoVideoUrl) throws Exception {
        Course course = new Course(courseName, description, price);

        CourseCategory category = this.courseCategoryRepository.findById(categoryId).orElseThrow(() -> new RuntimeException("Invalid Course Category"));

        course.setCategory(category);

        course.setStatus("PENDING");

        String usernameFromToken = this.jwtUtils.getUsernameFromToken(jwtToken);

        System.out.println(usernameFromToken);

        ApplicationUser user = this.userRepository.findByEmail(usernameFromToken).orElseThrow(() -> new RuntimeException("user not found!"));


        Teacher teacher = teacherRepository.findByUser(user).orElseThrow(() -> new Exception("not found such a user"));

        course.setTeacher(teacher);
        course.setDocumentUrl(documentUrl);
        course.setThumbnail(thumbnailUrl);
        course.setDemoVideo(demoVideoUrl);
//        System.out.println("Teacher = " + teacher.getUserId());


        this.courseRepository.save(course);


    }

    @Override
    public Course getCourseById(int courseId) {
        return courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));
    }

    @Override
    public boolean bookMarkCourse(int courseId, int userId) {
        Optional<ApplicationUser> userOptional = userRepository.findByUserId(userId);
        if (userOptional.isEmpty()) return false;
        ApplicationUser user = userOptional.get();
        Optional<Student> studentOptional = this.studentRepository.findByUser(user);

        if(studentOptional.isEmpty()) return false;

        Optional<Course> courseOptional = courseRepository.findById(courseId);

        if(courseOptional.isEmpty()) return false;

        Course course = courseOptional.get();

        Student student = studentOptional.get();

        List<Course> bookMarkedCourses = student.getBookMarkedCourses();

        bookMarkedCourses.add(course);

        student.setBookMarkedCourses(bookMarkedCourses);

        studentRepository.save(student);

        return true;


    }

//    ...............sali karelo area
    @Override
public void changeStatus(int id, String status) {
    Course course = courseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Course not found"));
    course.setStatus(status);
    courseRepository.save(course); // Save the updated course status
}

//    .....................
}
