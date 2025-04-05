package com.Eshiksha.repositories;

import com.Eshiksha.Entities.Course;
import com.Eshiksha.Entities.LiveClass;
import com.Eshiksha.Entities.Student;
import com.Eshiksha.Entities.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LiveClassRepository extends JpaRepository<LiveClass, Integer> {

    List<LiveClass> findByCourse(Course course);
    List<LiveClass> findByCourse_Teacher(Teacher teacher);
    // Custom query to fetch LiveClasses by Student (through enrolled courses)
    @Query("SELECT lc FROM LiveClass lc " +
            "JOIN lc.course c " +
            "JOIN c.enrolledStudents es " +
            "WHERE es = :student")  // Reference the Student entity directly
    List<LiveClass> findLiveClassesByStudent(Student student);
    }
