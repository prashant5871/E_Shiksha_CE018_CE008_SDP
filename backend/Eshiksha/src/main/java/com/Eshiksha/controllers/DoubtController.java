package com.Eshiksha.controllers;

import com.Eshiksha.Entities.ApplicationUser;
import com.Eshiksha.Entities.Lession;
import com.Eshiksha.Entities.LessionDoubt;
import com.Eshiksha.Entities.Student;
import com.Eshiksha.dto.SolutionDTO;
import com.Eshiksha.repositories.DoubtRepository;
import com.Eshiksha.repositories.LessionRepository;
import com.Eshiksha.repositories.StudentRepository;
import com.Eshiksha.repositories.UserRepository;
import com.Eshiksha.services.DoubtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.w3c.dom.stylesheets.LinkStyle;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/doubts")
public class DoubtController {

    private DoubtRepository doubtRepository;

    private UserRepository userRepository;
    private StudentRepository studentRepository;

    private LessionRepository lessionRepository;

    private DoubtService doubtService;

    public DoubtController(DoubtRepository doubtRepository, UserRepository userRepository, StudentRepository studentRepository, LessionRepository lessionRepository, DoubtService doubtService) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.doubtRepository = doubtRepository;
        this.lessionRepository = lessionRepository;
        this.doubtService = doubtService;
    }

    @GetMapping("/{courseId}/{userId}")
    public ResponseEntity<?> getDoubtByUserId(@PathVariable int userId,@PathVariable int courseId)
    {
        List<LessionDoubt> doubts =  doubtService.getDoubtsByUserIdAndCourseId(userId,courseId);
        return ResponseEntity.ok(doubts);
    }

    @PutMapping("/solution/{doubtId}")
    public ResponseEntity<?> addSolution(@PathVariable int doubtId,@RequestBody SolutionDTO solutionDTO)
    {
        doubtService.addSolution(doubtId,solutionDTO);
        Map<String,String> response = new HashMap<>();

        response.put("message","doubt updated sucesfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{lessionId}/{userId}")
    public ResponseEntity<Map<String, String>> submitDoubt(@PathVariable int lessionId, @PathVariable int userId, @RequestBody LessionDoubt lessionDoubt) {
        Lession lession = lessionRepository.findByLessionId(lessionId);

        Optional<ApplicationUser> userOptional = userRepository.findByUserId(userId);

        Map<String, String> response = new HashMap<>();

        if (userOptional.isEmpty()) {
            response.put("message", "User not found!");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        ApplicationUser user = userOptional.get();
        lessionDoubt.setLession(lession);

        Optional<Student> studentOptional = studentRepository.findByUser(user);
        if (studentOptional.isEmpty()) {
            response.put("message", "User not found!");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        Student student = studentOptional.get();
        lessionDoubt.setStudent(student);

        doubtRepository.save(lessionDoubt);

        student.getDoubts().add(lessionDoubt);
        lession.getDoubts().add(lessionDoubt);

        studentRepository.save(student);

        lessionRepository.save(lession);

        response.put("message", "Doubt uploaded succesfully!");
        return ResponseEntity.status(HttpStatus.OK).body(response);

    }
}
