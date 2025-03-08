package com.Eshiksha.services;

import com.Eshiksha.Entities.Course;
import com.Eshiksha.Entities.LiveClass;
import com.Eshiksha.Entities.Student;
import com.Eshiksha.Entities.Teacher;
import com.Eshiksha.dto.LiveClassDTO;
import com.Eshiksha.repositories.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LiveClassServiceImpl implements LiveClassService{
    private final LiveClassRepository liveClassRepository;
    private final CourseRepository courseRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;

    LiveClassServiceImpl(LiveClassRepository liveClassRepository, CourseRepository courseRepository, TeacherRepository teacherRepository, StudentRepository studentRepository) {
        this.liveClassRepository = liveClassRepository;
        this.courseRepository = courseRepository;
        this.teacherRepository = teacherRepository;
        this.studentRepository = studentRepository;
    }

    @Override
    public LiveClass createLiveClass(LiveClassDTO liveClassDTO) {
        // Fetch the Course entity using the courseId from DTO
        Course course = courseRepository.findById(liveClassDTO.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Create a new LiveClass entity and map fields from the DTO
        LiveClass liveClass = new LiveClass();
        liveClass.setCourse(course);  // Set the fetched Course entity
        liveClass.setScheduledTime(liveClassDTO.getScheduledTime());
        liveClass.setMeetingId(liveClassDTO.getMeetingId());
        liveClass.setTopic(liveClassDTO.getTopic());
        liveClass.setDuration(liveClassDTO.getDuration());

        // Save and return the LiveClass entity
        return liveClassRepository.save(liveClass);
    }

    @Override
    public List<LiveClass> getAllLiveClassesByCourse(int courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not Found !"));
        return liveClassRepository.findByCourse(course);
    }

    @Override
    public List<LiveClass> getAllLiveClassesByTeacher(int teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(()->new RuntimeException("Teacher not Found !"));
        return liveClassRepository.findByCourse_Teacher(teacher);
    }

    @Override
    public boolean deleteLiveClass(int liveClassId) {
        Optional<LiveClass> liveClassOpt = liveClassRepository.findById(liveClassId);

        if (liveClassOpt.isEmpty()) {
            return false;
        }

        liveClassRepository.deleteById(liveClassId);
        return true;
    }

    @Override
    public LiveClass updateLiveClass(int liveClassId, LiveClass liveClassDetails) {
        LiveClass liveClass = liveClassRepository.findById(liveClassId)
                .orElseThrow(()->new RuntimeException("Live Class not Found !"));
        liveClass.setTopic(liveClassDetails.getTopic());
        liveClass.setScheduledTime(liveClassDetails.getScheduledTime());
        liveClass.setMeetingId(liveClassDetails.getMeetingId());
        liveClass.setDuration(liveClassDetails.getDuration());
        return liveClassRepository.save(liveClass);
    }

    @Override
    public List<LiveClass> getAllLiveClassesByStudent(int studentId) {
        // Fetch the Student entity
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Fetch and return live classes related to courses the student is enrolled in
        return liveClassRepository.findByCourse_EnrolledStudents(student);
    }

}
