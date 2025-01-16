package com.Eshiksha.repositories;

import com.Eshiksha.Entities.Student;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

public class StudentRepositoryImpl implements StudentRepository {

	private EntityManager entityManager;
	
	public StudentRepositoryImpl(EntityManager entityManager)
	{
		this.entityManager = entityManager;
	}
	@Override
	@Transactional
	public Student createStudent(Student student) {
		entityManager.persist(student);
		return student;
	}

}
