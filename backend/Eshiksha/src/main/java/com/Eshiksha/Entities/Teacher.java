package com.Eshiksha.Entities;

import java.util.List;

import jakarta.persistence.*;

@Entity
//@PrimaryKeyJoinColumn(name = "userId")
public class Teacher {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int teacherId;


	@OneToMany(cascade = CascadeType.ALL)
	private List<Course> courses;

	public ApplicationUser getUser() {
		return user;
	}

	public void setUser(ApplicationUser user) {
		this.user = user;
	}

	@OneToOne
	@JoinColumn(name = "user_id")
	private ApplicationUser user;

	public Teacher() {
	}

	@Override
	public String toString() {
		return "Teacher{" +
				"courses=" + courses +
				'}';
	}
}
