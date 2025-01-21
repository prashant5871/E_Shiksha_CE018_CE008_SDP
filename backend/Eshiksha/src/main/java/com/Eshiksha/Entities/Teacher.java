package com.Eshiksha.Entities;

import java.util.List;

import jakarta.persistence.*;

@Entity
@PrimaryKeyJoinColumn(name = "userId")
public class Teacher extends ApplicationUser {


	@OneToMany(cascade = CascadeType.ALL)
	private List<Course> courses;

	public Teacher(ApplicationUser user) {
		super(user.getUserId(),user.getEmail(),user.getPassword(),user.getFirstName(),user.getLastName(),user.isEnabled(),user.getVerificationCode(),user.getRoles());
	}

	public Teacher() {
	}

	@Override
	public String toString() {
		return "Teacher{" +
				"courses=" + courses +
				'}';
	}
}
