package com.carrental.BookingService.Feign;

import com.carrental.BookingService.DTO.Car;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "car-service")
public interface CarClient {
    @GetMapping("/api/cars/{id}")
    Car getCarById(@PathVariable("id") int carId);
}
