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

    // Find student by email (inherited from ApplicationUser)
    Optional<Student> findByEmail(String email);

    Optional<ApplicationUser> findByVarificationCode(String varificationCode);


    // Find all students enrolled in a specific course
    @Query("SELECT s FROM Student s JOIN s.enrolledCourses c WHERE c.id = :courseId")
    List<Student> findStudentsByCourseId(Integer courseId);

    // Delete student by email
    void deleteByEmail(String email);
}
