package com.Eshiksha.repositories;

import com.Eshiksha.Entities.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course,Integer> {
    List<Course> findByCourseName(String courseName);

    List<Course> findByCourseNameContainingIgnoreCase(String courseName);

    List<Course> findByPriceBetween(float minPrice, float maxPrice);

    List<Course> findByCategory_CategoryName(String categoryName);

    List<Course> findByTeacher_UserId(int userId);

    List<Course> findByEnrolledStudents_UserId(int userId);

    List<Course> findByReviewsIsNotEmpty();

    long countByCategory_CategoryName(String categoryName);

    @Query("SELECT c FROM Course c WHERE c.price > :price ORDER BY c.price DESC")
    List<Course> findExpensiveCourses(float price);

}
