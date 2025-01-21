package com.Eshiksha.repositories;

import com.Eshiksha.Entities.Lession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessionRepository extends JpaRepository<Lession, Integer> {
    /**
     * Find all lessons associated with a specific course ID.
     *
     * @param courseId the ID of the course
     * @return a list of lessons
     */
    List<Lession> findByCourse_CourseId(int courseId);

    /**
     * Find a specific lesson by its ID.
     *
     * @param lessionId the ID of the lesson
     * @return the lesson entity
     */
    Lession findByLessionId(int lessionId);

    /**
     * Delete all lessons associated with a specific course ID.
     *
     * @param courseId the ID of the course
     */
    void deleteByCourse_CourseId(int courseId);
}
