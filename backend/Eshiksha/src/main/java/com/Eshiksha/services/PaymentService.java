package com.Eshiksha.services;

import com.Eshiksha.Entities.Course;
import com.Eshiksha.Entities.Payment;
import com.Eshiksha.Entities.Student;
import com.Eshiksha.repositories.CourseRepository;
import com.Eshiksha.repositories.PaymentRepository;
import com.Eshiksha.repositories.StudentRepository;
import com.Eshiksha.repositories.CourseRepository;
import com.Eshiksha.repositories.PaymentRepository;
import com.Eshiksha.repositories.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;



}
