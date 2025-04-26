package com.Eshiksha.services;

import com.Eshiksha.Entities.ApplicationUser;
import com.Eshiksha.Entities.LessionDoubt;
import com.Eshiksha.Entities.Student;
import com.Eshiksha.dto.SolutionDTO;
import com.Eshiksha.repositories.DoubtRepository;
import com.Eshiksha.repositories.StudentRepository;
import com.Eshiksha.repositories.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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
    public List<LessionDoubt> getDoubtsByUserIdAndCourseId(int userId, int courseId) {
        ApplicationUser user = userRepository.findByUserId(userId).orElseThrow();
        Student student = studentRepository.findByUser(user).orElseThrow();

        List<LessionDoubt> doubts = doubtRepository.findByStudent(student);

        // Filter doubts based on the given courseId
        return doubts.stream()
                .filter(doubt -> doubt.getLession().getCourse().getCourseId() == courseId).toList();
    }

    @Override
    public void addSolution(int doubtId, SolutionDTO solutionDTO) {
        LessionDoubt doubt = doubtRepository.findById(doubtId).orElseThrow();

        doubt.setSolution(solutionDTO.getSolution());

        doubtRepository.save(doubt);
    }

}
