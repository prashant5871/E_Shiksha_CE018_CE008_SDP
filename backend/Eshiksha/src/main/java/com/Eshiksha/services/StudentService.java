package com.Eshiksha.services;

import com.Eshiksha.Entities.ApplicationUser;
import com.Eshiksha.Entities.Course;
import com.Eshiksha.dto.PaymentDTO;

import java.util.List;

public interface StudentService {
    public ApplicationUser createStudent(ApplicationUser student);

    public ApplicationUser findByVarificationCode(String varificationCode);

    public ApplicationUser findByUserName(String username);

    void createStudentFromUser(ApplicationUser user);

    void enrollStudent(int courseId, int userId, PaymentDTO paymentDTO) throws Exception;

    List<Course> getMyCourses(int userId) throws Exception;

    void enrollStudentForFree(int courseId, int userId) throws Exception;
}
