package com.Eshiksha.services;

import com.Eshiksha.Entities.ApplicationUser;
import com.Eshiksha.Entities.Student;

public interface StudentService {
    public Student createStudent(Student student);

    public ApplicationUser findByVarificationCode(String varificationCode);
}
