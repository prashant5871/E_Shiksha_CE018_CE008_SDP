package com.Eshiksha.repositories;

import com.Eshiksha.Entities.ApplicationUser;
import com.Eshiksha.Entities.Student;

public interface StudentRepository {
	public Student createStudent(Student student);

    public ApplicationUser findByVarificationCode(String varificationCode);

}
