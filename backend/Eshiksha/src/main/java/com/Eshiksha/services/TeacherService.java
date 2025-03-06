package com.Eshiksha.services;

import com.Eshiksha.Entities.ApplicationUser;
import com.Eshiksha.Entities.Course;

import java.util.List;

public interface TeacherService {

    void createTeacher(ApplicationUser teacher);

    void createTeacherFromUser(ApplicationUser user);

    List<Course> getOwnCourses(String jwtToken);
}
