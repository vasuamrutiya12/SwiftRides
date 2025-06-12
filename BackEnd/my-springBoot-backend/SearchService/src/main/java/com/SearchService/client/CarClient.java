package com.SearchService.client;

import com.SearchService.dto.Car;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "car-service")
public interface CarClient {
    @GetMapping("/api/cars")
    List<Car> getAllCars();
}
