package com.Eshiksha.Entities;

import java.util.List;

import jakarta.persistence.*;


@Entity
//@PrimaryKeyJoinColumn(name = "userId")
public class Student{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int studentId;
	@ManyToMany(mappedBy = "enrolledStudents")
	private List<Course> enrolledCourses;
	
	@OneToMany
	private List<CourseReview> reviews;

	public ApplicationUser getUser() {
		return user;
	}

	//	@MapsId // Ensures Student uses the same ID as User
	@JoinColumn(name = "user_id") // Links User ID with Student
	@OneToOne(cascade = CascadeType.MERGE)
	private ApplicationUser user;


	public void setUser(ApplicationUser user) {
		this.user = user;
	}
}
