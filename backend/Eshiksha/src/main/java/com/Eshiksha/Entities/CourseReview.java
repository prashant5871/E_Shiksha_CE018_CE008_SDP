package com.Eshiksha.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class CourseReview {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int reviewId;

	private String comment;

	private int star; // out of five

	// Many reviews can belong to one user
	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private ApplicationUser user;


	// Many reviews can belong to one course
	@ManyToOne
	@JoinColumn(name = "course_id", nullable = false)
	@JsonIgnore
	private Course course;

	// Getters and Setters
	public int getReviewId() {
		return reviewId;
	}

	public void setReviewId(int reviewId) {
		this.reviewId = reviewId;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public int getStar() {
		return star;
	}

	public void setStar(int star) {
		this.star = star;
	}

	public ApplicationUser getUser() {
		return user;
	}

	public void setUser(ApplicationUser user) {
		this.user = user;
	}

	public Course getCourse() {
		return course;
	}

	public void setCourse(Course course) {
		this.course = course;
	}
}
