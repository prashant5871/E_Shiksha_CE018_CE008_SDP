package com.Eshiksha.repositories;

import com.Eshiksha.Entities.Teacher;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

@Repository
public interface TeacherRepository extends JpaRepositoryImplementation<Teacher, Integer> {
}
