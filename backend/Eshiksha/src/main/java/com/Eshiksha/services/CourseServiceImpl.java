package com.Eshiksha.services;

import com.Eshiksha.Entities.*;
import com.Eshiksha.Utils.JwtUtils;
import com.Eshiksha.repositories.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Service
public class CourseServiceImpl implements CourseService {

    @Value("${azure.storage.connection-string}")
    private String connectionString; // Fetch from application.properties

    @Value("${azure.storage.container.documents}")
    private String documentsContainer;

    @Value("${azure.storage.container.thumbnails}")
    private String thumbnailsContainer;
    private CourseRepository courseRepository;
    private CourseCategoryRepository courseCategoryRepository;

    private JwtUtils jwtUtils;
    private UserRepository userRepository;
    private TeacherRepository teacherRepository;

    private StudentRepository studentRepository;
    private VideoService videoService;
    private File thumbnailFolder;

    public CourseServiceImpl(CourseRepository courseRepository, CourseCategoryRepository courseCategoryRepository, JwtUtils jwtUtils, UserRepository userRepository, TeacherRepository teacherRepository, StudentRepository studentRepository, VideoService videoService) {
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.courseRepository = courseRepository;
        this.courseCategoryRepository = courseCategoryRepository;
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
        this.videoService = videoService;
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
    public void saveCourseAndFiles(MultipartFile thumbnail, MultipartFile demoVideo, MultipartFile document, String courseName, String description, float price, int categoryId, String jwtToken, int duration, HttpServletResponse response) throws Exception {
        String documentName = System.currentTimeMillis() + "_" + document.getOriginalFilename();
        Path documentPath = Paths.get("./documents/" + documentName);

        String thumbnailName = System.currentTimeMillis() + "_" + thumbnail.getOriginalFilename();
        Path thumbnailPath = Paths.get("./thumbnails/" + thumbnailName);

        String demoVideoName = System.currentTimeMillis() + "_" + demoVideo.getOriginalFilename();
        Path demoVideoPath = Paths.get("./video/" + demoVideoName);


//                    File vFolder = new File("./video");
//                    if (!vFolder.exists()) {
//                        Files.createDirectories(demoVideoPath.getParent());
//                    }
        File folder = new File("./documents");

        if (!folder.exists()) {
            Files.createDirectories(documentPath.getParent());
        }

        File thumbnailFolder = new File("./thumbnails");
        if (!thumbnailFolder.exists()) {
            Files.createDirectories(thumbnailPath.getParent());
        }

        Files.write(documentPath, document.getBytes());
        Files.write(thumbnailPath, thumbnail.getBytes());

        String documentUrl = documentPath.toAbsolutePath().toString();
        String thumbnailUrl = thumbnailPath.toAbsolutePath().toString();
//                    String demoVideoUrl = demoVideoPath.toString();

//                    Path videoPath = Paths.get("./video");
        String demoVideoLocation = this.videoService.processDummyVideo(demoVideo);

        this.create(courseName, description, price,
                categoryId, jwtToken, documentName, thumbnailName,demoVideoLocation,duration);

    }

    @Override
    public void updateCourseById(int courseId, String courseName, String description, int duration, float price, int categoryId) {
        try{
            Course course = courseRepository.findById(courseId).orElseThrow();

            course.setCourseName(courseName);
            course.setDescription(description);
            course.setDuration(duration);
            course.setPrice(price);
            course.setCategory(courseCategoryRepository.findById(categoryId).orElseThrow());

            courseRepository.save(course);
        }catch(Exception e){
            e.printStackTrace();
        }
    }


    @Override
    public void create(String courseName, String description, float price, int categoryId, String jwtToken, String documentUrl, String thumbnailUrl, String demoVideoUrl, int duration) throws Exception {
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
        course.setDuration(duration);
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

        if (studentOptional.isEmpty()) return false;

        Optional<Course> courseOptional = courseRepository.findById(courseId);

        if (courseOptional.isEmpty()) return false;

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

    @Override
    public void saveCourse(Course course) {

        courseRepository.save(course);
    }

    @Override
    public boolean removeFromBookMark(int courseId, int userId) {
        Optional<ApplicationUser> userOptional = userRepository.findByUserId(userId);
        if (userOptional.isEmpty()) return false;
        ApplicationUser user = userOptional.get();
        Optional<Student> studentOptional = this.studentRepository.findByUser(user);

        if (studentOptional.isEmpty()) return false;

        Optional<Course> courseOptional = courseRepository.findById(courseId);

        if (courseOptional.isEmpty()) return false;

        Course course = courseOptional.get();

        Student student = studentOptional.get();

        student.getBookMarkedCourses().remove(course);

        studentRepository.save(student);

        return true;
    }

    @Override
    public List<CourseCategory> findAllCategories() {
        List<CourseCategory> categories = courseCategoryRepository.findAll();

        return categories;
    }



}
