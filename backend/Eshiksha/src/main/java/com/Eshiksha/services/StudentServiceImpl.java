package com.Eshiksha.services;

import com.Eshiksha.Entities.*;
import com.Eshiksha.dto.PaymentDTO;
import com.Eshiksha.repositories.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class StudentServiceImpl implements StudentService {
    private StudentRepository studentRepository;
    private RoleRepository roleRepository;

    private UserRepository userRepository;

    private CourseRepository courseRepository;

    private PaymentRepository paymentRepository;

    public StudentServiceImpl(StudentRepository studentRepository, RoleRepository roleRepository, UserRepository userRepository, CourseRepository courseRepository, PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
        this.courseRepository = courseRepository;
        this.studentRepository = studentRepository;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }


    @Override
    public ApplicationUser createStudent(ApplicationUser student) {
        try {
            student.setEnabled(false);
            Set<Role> roles = new HashSet<>();

            Role role = roleRepository.findByName("ROLE_STUDENT").get();
            roles.add(role);

            student.setRoles(roles);

            String varificationCode = UUID.randomUUID().toString();

            System.out.println("Varification code is : " + varificationCode);
            student.setVerificationCode(varificationCode);


            userRepository.save(student);

            Student student1 = new Student();
            student1.setUser(userRepository.findByEmail(student.getEmail()).get());
            studentRepository.save(student1);

            return student;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public ApplicationUser findByVarificationCode(String varificationCode) {
        ApplicationUser appUser = userRepository.findByVarificationCode(varificationCode).get();

        return appUser;

    }

    @Override
    public ApplicationUser findByUserName(String username) {
        return this.userRepository.findByEmail(username).get();
    }

    @Override
    @Transactional
    public void createStudentFromUser(ApplicationUser user) {
        Student newStudent = new Student();
        newStudent.setUser(userRepository.findByEmail(user.getEmail()).get());
        studentRepository.save(newStudent);

    }

    @Override
    @Transactional
    public void enrollStudent(int courseId, int userId, PaymentDTO paymentDTO) throws Exception {
        ApplicationUser appUser = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        Student student = studentRepository.findByUser(appUser)
                .orElseThrow(() -> new Exception("Student not found for userId: " + userId));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new Exception("Course not found"));
        if (!student.getEnrolledCourses().contains(course)) {
            if (course.getPrice() > 0)
                processPayment(student, course);
            student.getEnrolledCourses().add(course);
            course.getEnrolledStudents().add(student);
            studentRepository.save(student);
            courseRepository.save(course);

        } else {
            throw new Exception("Student already enrolled in the course");
        }
    }

    @Override
    public List<Course> getMyCourses(int userId) throws Exception {
        ApplicationUser user = userRepository.findByUserId(userId).orElseThrow(()->new Exception("no user found"));
        Student student = studentRepository.findByUser(user).orElseThrow();

        return student.getEnrolledCourses();

    }

    @Override
    public void enrollStudentForFree(int courseId, int userId) throws Exception {
        ApplicationUser appUser = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        Student student = studentRepository.findByUser(appUser)
                .orElseThrow(() -> new Exception("Student not found for userId: " + userId));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new Exception("Course not found"));
        if (!student.getEnrolledCourses().contains(course)) {
            student.getEnrolledCourses().add(course);
            course.getEnrolledStudents().add(student);
            studentRepository.save(student);
            courseRepository.save(course);
        }
    }

    public void processPayment(Student student, Course course) throws Exception {

        // Generate a fake transaction ID
        String transactionId = UUID.randomUUID().toString();

        // Create and save the payment record
        Payment payment = new Payment(student, course, course.getPrice(), transactionId, "SUCCESS");
        paymentRepository.save(payment);

    }

}
