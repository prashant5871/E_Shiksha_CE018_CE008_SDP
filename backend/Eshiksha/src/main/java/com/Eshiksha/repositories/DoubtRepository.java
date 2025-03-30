package com.Eshiksha.repositories;

import com.Eshiksha.Entities.LessionDoubt;
import com.Eshiksha.Entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoubtRepository extends JpaRepository<LessionDoubt,Integer> {
    List<LessionDoubt> findByStudent(Student student);

}
