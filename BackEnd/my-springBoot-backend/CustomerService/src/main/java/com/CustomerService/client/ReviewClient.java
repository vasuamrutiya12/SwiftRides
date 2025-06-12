package com.CustomerService.client;

import com.CustomerService.dto.ReviewDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "review-service")
public interface ReviewClient {
    @PostMapping("/api/reviews/car/{carId}/customer/{customerId}")
    public ReviewDto createReview(@PathVariable("carId") Integer carId, @PathVariable("customerId") Integer customerId, @RequestBody ReviewDto request);

    @GetMapping("/api/reviews/customer/{customerId}")
    public ResponseEntity<List<ReviewDto>> getCustomerReviews(@PathVariable Integer customerId) ;
}
