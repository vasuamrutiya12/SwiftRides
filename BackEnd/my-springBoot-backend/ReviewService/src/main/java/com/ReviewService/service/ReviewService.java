package com.ReviewService.service;

import com.ReviewService.dto.ReviewDto;
import com.ReviewService.model.Report;
import com.ReviewService.model.Review;

import java.util.List;

public interface ReviewService {

    Review addReview(Integer carId,Integer customerId,ReviewDto request);
    List<Review> getReviewsByCarId(Integer carId);
    Double getAverageRating(Integer carId);
    List<Review> getReviewsByCustomerId(Integer customerId);
    List<Review> getAllReviews();
    void deleteAllReviews();
    List<Review> getReviewsByCompanyId(Integer companyId);
    Review addReply(int id,ReviewDto reply);
    Review addReport(int id, ReviewDto report);

    Long countByCarId(Integer carId);
    Long countByCustomerId(Integer customerId);
    Long countByCompanyId(Integer companyId);
}
