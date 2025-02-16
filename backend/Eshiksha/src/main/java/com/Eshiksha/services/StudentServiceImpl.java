package com.Eshiksha.services;

import com.Eshiksha.Entities.ApplicationUser;
import com.Eshiksha.Entities.Role;
import com.Eshiksha.Entities.Student;
import com.Eshiksha.repositories.*;
import org.springframework.mail.javamail.JavaMailSender;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
public class StudentServiceImpl implements StudentService {
    private StudentRepository studentRepository;
    private RoleRepository roleRepository;

    private UserRepository userRepository;

    public StudentServiceImpl(StudentRepository studentRepository, RoleRepository roleRepository, UserRepository userRepository) {
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

}
