package com.Eshiksha.Entities;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;


@Entity
public class Student extends ApplicationUser {
	
	@ManyToMany
	private List<Course> enrolledCourses;
	
	@OneToMany
	private List<CourseReview> reviews;
	
	
}
