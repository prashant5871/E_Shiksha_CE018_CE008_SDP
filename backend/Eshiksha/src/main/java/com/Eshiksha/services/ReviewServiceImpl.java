package com.Eshiksha.services;

import com.Eshiksha.Entities.CourseReview;
import com.Eshiksha.dto.CourseReviewDTO;
import com.Eshiksha.repositories.ReviewRepository;
import org.springframework.stereotype.Service;

@Service
public class ReviewServiceImpl implements ReviewService {
    private ReviewRepository reviewRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @Override
    public CourseReview updateReview(int reviewId, CourseReviewDTO courseReview) {
        CourseReview oldReview = reviewRepository.findById(reviewId).orElseThrow();
        oldReview.setStar(courseReview.getStar());
        oldReview.setComment(courseReview.getComment());

        return reviewRepository.save(oldReview);
    }
}
