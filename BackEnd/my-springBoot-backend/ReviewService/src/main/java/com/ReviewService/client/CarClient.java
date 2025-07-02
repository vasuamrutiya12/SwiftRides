package com.ReviewService.client;

import com.ReviewService.dto.CarDto;
import com.ReviewService.dto.ReviewDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "car-service")
public interface CarClient {


    @GetMapping("/api/cars/{id}")
    public ResponseEntity<CarDto> getCarById(@PathVariable int id);
}