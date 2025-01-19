package com.Eshiksha.repositories;

import com.Eshiksha.Entities.Teacher;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepositoryImplementation<Teacher, Integer> {

    // Find a teacher by email
    Optional<Teacher> findByEmail(String email);

    // Find all teachers by their first name
    List<Teacher> findByFirstName(String firstName);

    // Find all teachers by last name
    List<Teacher> findByLastName(String lastName);

    // Custom query to fetch teachers associated with a specific course by course name
//    @Query("SELECT t FROM Teacher t JOIN t.courses c WHERE c.name = :courseName")
//    List<Teacher> findTeachersByCourseName(@Param("courseName") String courseName);
//
//    // Custom query to fetch teachers associated with a specific course ID
//    @Query("SELECT t FROM Teacher t JOIN t.courses c WHERE c.id = :courseId")
//    List<Teacher> findTeachersByCourseId(@Param("courseId") Integer courseId);

    // Custom query to fetch all teachers enabled in the system
    List<Teacher> findByEnabled(boolean enabled);

}
