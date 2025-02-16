package com.Eshiksha.services;

import com.Eshiksha.Entities.ApplicationUser;

public interface TeacherService {

    void createTeacher(ApplicationUser teacher);

    void createTeacherFromUser(ApplicationUser user);
}
