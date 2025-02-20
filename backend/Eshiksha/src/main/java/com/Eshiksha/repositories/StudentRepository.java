package com.Eshiksha.repositories;

import com.Eshiksha.Entities.ApplicationUser;
import com.Eshiksha.Entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {
    // Find a student by their associated user
    Optional<Student> findByUser(ApplicationUser user);

    // Find a student by user ID
//    Optional<Student> findByUserId(Integer userId);

    // Check if a student exists by user ID
//    boolean existsByUserId(Integer userId);

    // Find all students enrolled in a specific course (Assuming enrolledCourses contains Course ID)
//    List<Student> findByEnrolledCoursesId(Integer courseId);

    // Delete a student by user ID
//    void deleteByUserId(Integer userId);
}
