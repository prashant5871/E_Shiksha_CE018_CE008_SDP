package com.Eshiksha.controllers;

import com.Eshiksha.Entities.ApplicationUser;
import com.Eshiksha.Entities.Course;
import com.Eshiksha.Entities.CourseCategory;
import com.Eshiksha.Entities.CourseReview;
import com.Eshiksha.dto.CourseReviewDTO;
import com.Eshiksha.repositories.CourseRepository;
import com.Eshiksha.repositories.ReviewRepository;
import com.Eshiksha.repositories.UserRepository;
import com.Eshiksha.services.ReviewService;
import com.azure.core.annotation.Get;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/review")
public class ReviewController {

    private CourseRepository courseRepository;
    private UserRepository userRepository;
    private ReviewRepository reviewRepository;

    private ReviewService reviewService;

    public ReviewController(CourseRepository courseRepository, UserRepository userRepository, ReviewRepository reviewRepository, ReviewService reviewService) {
        this.reviewRepository = reviewRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.reviewService = reviewService;
    }

    @PostMapping("/{courseId}/{userId}")
    public ResponseEntity<?> reviewCourse(@PathVariable int courseId, @PathVariable int userId, @RequestBody CourseReview courseReview) {
        Map<String, String> response = new HashMap<>();

        Optional<Course> courseOptional = courseRepository.findById(courseId);

        if (courseOptional.isEmpty()) {
            response.put("message", "course not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        Optional<ApplicationUser> userOptional = userRepository.findByUserId(userId);

        if (userOptional.isEmpty()) {
            response.put("message", "user not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);

        }

        courseReview.setCourse(courseOptional.get());
        courseReview.setUser(userOptional.get());

        CourseReview courseReview1 = reviewRepository.save(courseReview);

        ApplicationUser user = userOptional.get();

        user.getReviews().add(courseReview);

        userRepository.save(user);

        Course course = courseOptional.get();
        course.getReviews().add(courseReview);

        courseRepository.save(course);
        response.put("message", "Review submitted succesfully !");
        return ResponseEntity.status(HttpStatus.OK).body(courseReview1);

    }

    @GetMapping("/{courseId}")
    public ResponseEntity<List<CourseReview>> getReviewByCourseId(@PathVariable int courseId)
    {
        Optional<Course> courseOptional = courseRepository.findById(courseId);

        if(courseOptional.isEmpty()) return null;

        Course course = courseOptional.get();

        return ResponseEntity.status(HttpStatus.OK).body(course.getReviews());
    }

    @GetMapping("/")
    public ResponseEntity<List<CourseReview>> getAllReviews()
    {
        return ResponseEntity.status(HttpStatus.OK).body(reviewRepository.findAll());
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<?> updateReview(@PathVariable int reviewId,@RequestBody CourseReviewDTO courseReview)
    {
        CourseReview courseReview1 = reviewService.updateReview(reviewId,courseReview);

        return ResponseEntity.status(HttpStatus.OK).body(courseReview1);
    }
}
