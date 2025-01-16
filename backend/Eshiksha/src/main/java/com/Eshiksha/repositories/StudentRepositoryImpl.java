package com.Eshiksha.repositories;

import com.Eshiksha.Entities.Student;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

@Repository
public class StudentRepositoryImpl implements StudentRepository {

	private EntityManager entityManager;
	
	public StudentRepositoryImpl(EntityManager entityManager)
	{
		this.entityManager = entityManager;
	}
	@Override
	@Transactional
	public Student createStudent(Student student) {
		student.setEnabled(false);
		entityManager.persist(student);
		return student;
	}

}
