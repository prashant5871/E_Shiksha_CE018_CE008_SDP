package com.Eshiksha.Entities;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

@Entity
public class Teacher extends ApplicationUser {
	
	@OneToMany(cascade = CascadeType.ALL)
	private List<Course> courses;
}
