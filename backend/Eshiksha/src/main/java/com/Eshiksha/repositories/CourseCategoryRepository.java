package com.Eshiksha.repositories;

import com.Eshiksha.Entities.CourseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseCategoryRepository extends JpaRepository<CourseCategory, Integer> {
    // You can add custom queries here if needed
}