package com.Eshiksha.services;

import com.Eshiksha.Entities.CourseReview;
import com.Eshiksha.dto.CourseReviewDTO;

public interface ReviewService {
    CourseReview updateReview(int reviewId, CourseReviewDTO courseReview);
}
