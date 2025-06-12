package com.RentalCompaniesService.client;

import com.RentalCompaniesService.Dto.ReviewDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
@FeignClient(name = "review-service")
public interface ReviewServiceClient {
    @GetMapping("/")
    public ResponseEntity<List<ReviewDto>> getAllReviews() ;

}
