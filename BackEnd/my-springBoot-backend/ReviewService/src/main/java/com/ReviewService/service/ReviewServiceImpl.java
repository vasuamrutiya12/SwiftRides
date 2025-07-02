package com.ReviewService.service;

import com.ReviewService.client.CarClient;
import com.ReviewService.dto.CarDto;
import com.ReviewService.dto.ReviewDto;
import com.ReviewService.model.Report;
import com.ReviewService.model.Review;
import com.ReviewService.repo.ReviewRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepo reviewRepository;

    @Autowired
    private CarClient carClient;

    @Override
    public Review addReview(Integer carId, Integer customerId, ReviewDto request) {
        Optional<Review> existingReview = reviewRepository.findByCarIdAndCustomerId(carId, customerId);
        Review review;

        if (existingReview.isPresent()) {
            review = existingReview.get();
            review.setRating(request.getRating());
            review.setComment(request.getComment());
        } else {
            ResponseEntity<CarDto> carDtoResponse = carClient.getCarById(carId);

            if (carDtoResponse.getStatusCode().is2xxSuccessful() && carDtoResponse.getBody() != null) {
                CarDto carDto = carDtoResponse.getBody();
                Integer companyId = carDto.getCompanyId();

                review = Review.builder()
                        .carId(carId)
                        .companyId(companyId)
                        .customerId(customerId)
                        .rating(request.getRating())
                        .comment(request.getComment())
                        .createdAt(new Date())
                        .build();
            } else {
                throw new RuntimeException("Failed to fetch car details for carId: " + carId);
            }
        }

        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getReviewsByCarId(Integer carId) {
        return reviewRepository.findByCarId(carId);
    }

    @Override
    public List<Review> getReviewsByCustomerId(Integer customerId) {
        return reviewRepository.findByCustomerId(customerId);
    }

    @Override
    public List<Review> getReviewsByCompanyId(Integer companyId) {
        return reviewRepository.findByCompanyId(companyId);
    }

    @Override
    public Double getAverageRating(Integer carId) {
        return reviewRepository.findAverageRatingByCarId(carId);
    }

    @Override
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    @Override
    public void deleteAllReviews() {
        reviewRepository.deleteAll();
    }

    @Override
    public Review addReply(int id, ReviewDto reply) {
        Optional<Review> existingReview = reviewRepository.findById(id);
        if (existingReview.isPresent()) {
            Review review = existingReview.get();
            review.setReply(reply.getReply());
            return reviewRepository.save(review);
        } else {
            throw new RuntimeException("Failed to fetch review details for reviewId: " + id);
        }
    }

    @Override
    public Review addReport(int id, ReviewDto reportDto) {
        Optional<Review> existingReview = reviewRepository.findById(id);

        if (existingReview.isPresent()) {
            Review review = existingReview.get();

            Report reportFromDto = reportDto.getReport();
            if (reportFromDto == null) {
                throw new RuntimeException("Missing report data in request body");
            }

            reportFromDto.setReviewId(id);
            review.setReport(reportFromDto);

            return reviewRepository.save(review);
        } else {
            throw new RuntimeException("Failed to fetch review details for reviewId: " + id);
        }
    }

    public Long countByCarId(Integer carId) {
        return reviewRepository.countByCarId(carId);
    }

    public Long countByCustomerId(Integer customerId) {
        return reviewRepository.countByCustomerId(customerId);
    }

    public Long countByCompanyId(Integer companyId) {
        return reviewRepository.countByCompanyId(companyId);
    }
}
