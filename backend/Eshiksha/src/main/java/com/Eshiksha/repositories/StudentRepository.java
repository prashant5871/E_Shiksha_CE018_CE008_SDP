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


    @Query("SELECT s FROM Student s WHERE s.user.id = :userId")
    Optional<Student> findByUserId(Integer userId);

}
