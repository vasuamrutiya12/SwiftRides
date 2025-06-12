package com.RentalCompaniesService.client;

import com.RentalCompaniesService.Dto.CarDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "car-service", fallback = CarServiceClientFallback.class)
public interface CarServiceClient {

    @GetMapping("/api/cars/companyid/{companyId}")
    List<CarDto> getCarsofCompany(@PathVariable("companyId") Integer companyId);

    @PostMapping("/api/cars")
    CarDto registerCar(@RequestBody CarDto request);

    @PutMapping("/api/cars/{id}")
    ResponseEntity<CarDto> updateCar(@PathVariable int id, @RequestBody CarDto carDetails);

    @GetMapping("/api/cars/total/companyId/{companyId}")
    ResponseEntity<Integer> findTotalCars(@PathVariable("companyId") Integer companyId);
}
