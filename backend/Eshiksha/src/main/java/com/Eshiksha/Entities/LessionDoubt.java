package com.Eshiksha.Entities;

import jakarta.persistence.*;

@Entity
public class LessionDoubt {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int doubtId;

	private String doubt;

	// Many doubts can belong to one student
	@ManyToOne
	@JoinColumn(name = "student_id", nullable = false)
	private Student student;

	// Many doubts can belong to one lesson
	@ManyToOne
	@JoinColumn(name = "lession_id", nullable = false)
	private Lession lession;

	// Getters and Setters
	public int getDoubtId() {
		return doubtId;
	}

	public void setDoubtId(int doubtId) {
		this.doubtId = doubtId;
	}

	public String getDoubt() {
		return doubt;
	}

	public void setDoubt(String doubt) {
		this.doubt = doubt;
	}

	public Student getStudent() {
		return student;
	}

	public void setStudent(Student student) {
		this.student = student;
	}

	public Lession getLession() {
		return lession;
	}

	public void setLession(Lession lession) {
		this.lession = lession;
	}
}
