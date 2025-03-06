package com.Eshiksha.repositories;

import com.Eshiksha.Entities.Course;
import com.Eshiksha.Entities.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course,Integer> {
    List<Course> findByTeacher(Teacher teacher);

}
