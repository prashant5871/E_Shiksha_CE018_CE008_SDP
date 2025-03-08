package com.Eshiksha.repositories;

import com.Eshiksha.Entities.Course;
import com.Eshiksha.Entities.LiveClass;
import com.Eshiksha.Entities.Student;
import com.Eshiksha.Entities.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LiveClassRepository extends JpaRepository<LiveClass, Integer> {

    List<LiveClass> findByCourse(Course course);
    List<LiveClass> findByCourse_Teacher(Teacher teacher);
    List<LiveClass> findByCourse_EnrolledStudents(Student student);
}
