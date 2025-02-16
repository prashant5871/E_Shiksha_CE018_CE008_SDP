package com.Eshiksha.services;

import com.Eshiksha.Entities.ApplicationUser;
import com.Eshiksha.Entities.Student;

public interface StudentService {
    public ApplicationUser createStudent(ApplicationUser student);

    public ApplicationUser findByVarificationCode(String varificationCode);

    public ApplicationUser findByUserName(String username);

    void createStudentFromUser(ApplicationUser user);
}
