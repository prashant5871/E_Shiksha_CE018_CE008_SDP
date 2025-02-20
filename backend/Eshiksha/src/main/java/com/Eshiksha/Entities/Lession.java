package com.Eshiksha.Entities;

import jakarta.persistence.*;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Lession {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int lessionId;

	private String title;

	@Column(length = 1000)
	private String description;

	private String contentUrl;

	private Duration duration;

	private int sequenceNumber;

	@ManyToOne
	@JoinColumn(name = "courseId", nullable = false)
	private Course course;

	@Column(length = 2000)
	private String resources;

	private String status; // E.g., Draft, Published, Archived

	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;

	@OneToMany(mappedBy = "lession", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<LessionDoubt> doubts = new ArrayList<>();


	// Constructors
	public Lession() {
	}

	public Lession(String title, String description, String contentUrl, Duration duration, int sequenceNumber,
				   Course course, String resources, String status, LocalDateTime createdAt, LocalDateTime updatedAt) {
		this.title = title;
		this.description = description;
		this.contentUrl = contentUrl;
		this.duration = duration;
		this.sequenceNumber = sequenceNumber;
		this.course = course;
		this.resources = resources;
		this.status = status;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	// Getters and Setters
	public int getLessionId() {
		return lessionId;
	}

	public void setLessionId(int lessionId) {
		this.lessionId = lessionId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getContentUrl() {
		return contentUrl;
	}

	public void setContentUrl(String contentUrl) {
		this.contentUrl = contentUrl;
	}

	public Duration getDuration() {
		return duration;
	}

	public void setDuration(Duration duration) {
		this.duration = duration;
	}

	public int getSequenceNumber() {
		return sequenceNumber;
	}

	public void setSequenceNumber(int sequenceNumber) {
		this.sequenceNumber = sequenceNumber;
	}

	public Course getCourse() {
		return course;
	}

	public void setCourse(Course course) {
		this.course = course;
	}

	public String getResources() {
		return resources;
	}

	public void setResources(String resources) {
		this.resources = resources;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	@PrePersist
	protected void onCreate() {
		this.createdAt = LocalDateTime.now();
		this.updatedAt = LocalDateTime.now();
	}

	@PreUpdate
	protected void onUpdate() {
		this.updatedAt = LocalDateTime.now();
	}

	@Override
	public String toString() {
		return "Lession{" +
				"lessionId=" + lessionId +
				", title='" + title + '\'' +
				", description='" + description + '\'' +
				", contentUrl='" + contentUrl + '\'' +
				", duration=" + duration +
				", sequenceNumber=" + sequenceNumber +
				", course=" + course +
				", resources='" + resources + '\'' +
				", status='" + status + '\'' +
				", createdAt=" + createdAt +
				", updatedAt=" + updatedAt +
				'}';
	}

	public List<LessionDoubt> getDoubts() {
		return doubts;
	}

	public void setDoubts(List<LessionDoubt> doubts) {
		this.doubts = doubts;
	}
}
