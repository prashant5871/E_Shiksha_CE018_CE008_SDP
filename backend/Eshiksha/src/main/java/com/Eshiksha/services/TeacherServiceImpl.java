package com.Eshiksha.services;

import com.Eshiksha.Entities.*;
import com.Eshiksha.Utils.JwtUtils;
import com.Eshiksha.repositories.CourseRepository;
import com.Eshiksha.repositories.RoleRepository;
import com.Eshiksha.repositories.TeacherRepository;
import com.Eshiksha.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;


@Service
public class TeacherServiceImpl implements TeacherService {
    private TeacherRepository teacherRepository;
    private RoleRepository roleRepository;

    private UserRepository userRepository;
    private CourseRepository courseRepository;
    private JwtUtils jwtUtils;

    public TeacherServiceImpl(TeacherRepository teacherRepository, UserRepository userRepository, RoleRepository roleRepository, CourseRepository courseRepository, CourseRepository courseRepository1, JwtUtils jwtUtils)
    {
        this.roleRepository = roleRepository;
        this.teacherRepository = teacherRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository1;
        this.jwtUtils = jwtUtils;
    }
    @Override
    public void createTeacher(ApplicationUser teacher) {
        Set<Role> roles = new HashSet<>();

            Role role = roleRepository.findByName("ROLE_TEACHER").get();
            roles.add(role);

            teacher.setRoles(roles);

            String varificationCode = UUID.randomUUID().toString();

            System.out.println("Varification code is : " + varificationCode);
            teacher.setVerificationCode(varificationCode);
            teacher.setEnabled(false);

            userRepository.save(teacher);

            System.out.println("Before save teacher 1");

            Teacher teacher1 = new Teacher();
            teacher1.setUser(userRepository.findByEmail(teacher.getEmail()).get());

            teacherRepository.save(teacher1);

            System.out.println("After saving teacher1");
    }

    @Override
    public void createTeacherFromUser(ApplicationUser user) {
        Teacher newStudent = new Teacher();
        newStudent.setUser(userRepository.findByEmail(user.getEmail()).get());
        teacherRepository.save(newStudent);
    }

    @Override
    public List<Course> getOwnCourses(String jwtToken) {
        try{
            String usernameFromToken = this.jwtUtils.getUsernameFromToken(jwtToken);
            System.out.println("user name from the token : " + usernameFromToken);
            ApplicationUser user = this.userRepository.findByEmail(usernameFromToken).orElseThrow();
            System.out.println("user not found");
            Teacher teacher = this.teacherRepository.findByUser(user).orElseThrow();
            System.out.println("teacher not found");

            List<Course> courses = courseRepository.findByTeacher(teacher);
            System.out.println("all courses\n");
            courses.forEach(course -> {
                System.out.println(course.getCourseName());
            });

            return courses;

        }catch(Exception e)
        {
            e.printStackTrace();
            return null;
        }
    }
}
