package com.Eshiksha.repositories;

import com.Eshiksha.Entities.ApplicationUser;
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
		entityManager.persist(student);
		return student;
	}

	@Override
	public ApplicationUser findByVarificationCode(String varificationCode) {

		ApplicationUser appUser = entityManager.createQuery("FROM ApplicationUser where varificationCode=:varificationCode", ApplicationUser.class)
				.setParameter("varificationCode",varificationCode)
				.getSingleResult();

		return appUser;
	}

}
