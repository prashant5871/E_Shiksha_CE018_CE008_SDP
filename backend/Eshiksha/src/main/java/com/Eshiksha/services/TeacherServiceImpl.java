package com.Eshiksha.services;

import com.Eshiksha.Entities.ApplicationUser;
import com.Eshiksha.Entities.Role;
import com.Eshiksha.Entities.Student;
import com.Eshiksha.Entities.Teacher;
import com.Eshiksha.repositories.RoleRepository;
import com.Eshiksha.repositories.TeacherRepository;
import com.Eshiksha.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;


@Service
public class TeacherServiceImpl implements TeacherService {
    private TeacherRepository teacherRepository;
    private RoleRepository roleRepository;

    private UserRepository userRepository;

    public TeacherServiceImpl(TeacherRepository teacherRepository,UserRepository userRepository,RoleRepository roleRepository)
    {
        this.roleRepository = roleRepository;
        this.teacherRepository = teacherRepository;
        this.userRepository = userRepository;
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
}
