package com.Eshiksha.repositories;

import com.Eshiksha.Entities.LessionDoubt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoubtRepository extends JpaRepository<LessionDoubt,Integer> {
}
