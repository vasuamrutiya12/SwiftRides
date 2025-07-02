package com.ReviewService.controller;

import com.ReviewService.dto.ReviewDto;
import com.ReviewService.model.Review;
import com.ReviewService.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/car/{carId}/customer/{customerId}")
    public Review createReview(@PathVariable("carId") Integer carId,@PathVariable("customerId") Integer customerId,@RequestBody ReviewDto request) {
        return reviewService.addReview(carId,customerId,request);
    }

    @GetMapping("/car/{carId}")
    public List<Review> getCarReviews(@PathVariable Integer carId) {
        return reviewService.getReviewsByCarId(carId);
    }


    @GetMapping("/car/{carId}/average-rating")
    public Double getAverageRating(@PathVariable Integer carId) {
        return reviewService.getAverageRating(carId);
    }


    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Review>> getCustomerReviews(@PathVariable Integer customerId) {
        List<Review> reviews = reviewService.getReviewsByCustomerId(customerId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Review>> getAllReviews() {
        List<Review> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }

    @DeleteMapping("/all")
    public ResponseEntity<String> deleteAllReviews() {
        reviewService.deleteAllReviews();
        return ResponseEntity.ok("All reviews deleted successfully.");
    }

    @GetMapping("/companyId/{companyId}")
    public ResponseEntity<List<Review>> getCompanyReviews(@PathVariable Integer companyId) {
        List<Review> reviews = reviewService.getReviewsByCompanyId(companyId);
        return ResponseEntity.ok(reviews);
    }

    @PutMapping("/{id}/addReply")
    public Review addReply(@PathVariable("id") Integer id,@RequestBody ReviewDto reply){
        return reviewService.addReply(id,reply);
    }

    @PutMapping("/{id}/addReport")
    public Review addReport(@PathVariable("id") Integer id,@RequestBody ReviewDto report){
        return reviewService.addReport(id,report);
    }

    @GetMapping("/car/{carId}/count")
    public Long getReviewCountByCar(@PathVariable Integer carId) {
        return reviewService.countByCarId(carId);
    }

    @GetMapping("/customer/{customerId}/count")
    public Long getReviewCountByCustomer(@PathVariable Integer customerId) {
        return reviewService.countByCustomerId(customerId);
    }

    @GetMapping("/company/{companyId}/count")
    public Long getReviewCountByCompany(@PathVariable Integer companyId) {
        return reviewService.countByCompanyId(companyId);
    }

}
