package com.Eshiksha.Entities;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class LiveClass {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int liveClassId;
    @Temporal(TemporalType.TIMESTAMP)
    private Date scheduledTime;
    private String meetingId;
    private String topic;
    private int duration;
    @ManyToOne
    @JoinColumn(name="courseId", nullable = false)
    private Course course;

    public LiveClass() {
    }

    public LiveClass(int liveClassId, Date scheduledTime, String meetingId, String topic, int duration, Course course) {
        this.liveClassId = liveClassId;
        this.scheduledTime = scheduledTime;
        this.meetingId = meetingId;
        this.topic = topic;
        this.duration = duration;
        this.course = course;
    }

    public int getLiveClassId() {
        return liveClassId;
    }

    public void setLiveClassId(int liveClassId) {
        this.liveClassId = liveClassId;
    }

    public Date getScheduledTime() {
        return scheduledTime;
    }

    public void setScheduledTime(Date scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public String getMeetingId() {
        return meetingId;
    }

    public void setMeetingId(String meetingId) {
        this.meetingId = meetingId;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    @Override
    public String toString() {
        return "LiveClass{" +
                "liveClassId=" + liveClassId +
                ", scheduledTime=" + scheduledTime +
                ", meetingId='" + meetingId + '\'' +
                ", topic='" + topic + '\'' +
                ", course=" + course +
                '}';
    }
}
