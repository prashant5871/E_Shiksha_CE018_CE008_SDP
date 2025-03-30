package com.Eshiksha.services;

import com.Eshiksha.Entities.ApplicationUser;
import com.Eshiksha.Entities.LessionDoubt;
import com.Eshiksha.Entities.Student;
import com.Eshiksha.repositories.DoubtRepository;
import com.Eshiksha.repositories.StudentRepository;
import com.Eshiksha.repositories.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoubtServiceImpl implements DoubtService {
    private DoubtRepository doubtRepository;
    private UserRepository userRepository;

    private StudentRepository studentRepository;

    public DoubtServiceImpl(DoubtRepository doubtRepository, UserRepository userRepository, StudentRepository studentRepository) {
        this.doubtRepository = doubtRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
    }

    @Override
    public List<LessionDoubt> getDoubtByUserId(int userId) {

        ApplicationUser user = userRepository.findByUserId(userId).orElseThrow();
        Student student = studentRepository.findByUser(user).orElseThrow();
        return doubtRepository.findByStudent(student);
    }
}
