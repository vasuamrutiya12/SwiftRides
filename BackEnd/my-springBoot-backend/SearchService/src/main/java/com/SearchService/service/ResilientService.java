package com.SearchService.service;

import com.SearchService.client.CarClient;
import com.SearchService.client.RentalCompanyClient;
import com.SearchService.dto.Car;
import com.SearchService.dto.RentalCompany;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResilientService {

    private final CarClient carClient;
    private final RentalCompanyClient rentalCompanyClient;

    @Autowired
    public ResilientService(CarClient carClient, RentalCompanyClient rentalCompanyClient) {
        this.carClient = carClient;
        this.rentalCompanyClient = rentalCompanyClient;
    }

    @CircuitBreaker(name = "carServiceCB", fallbackMethod = "fallbackGetAllCars")
    public List<Car> getAllCars() {
        return carClient.getAllCars();
    }

    public List<Car> fallbackGetAllCars(Throwable t) {
        System.err.println("Fallback triggered for getAllCars: " + t.getMessage());
        return List.of(); // return empty list or default cars
    }

    @CircuitBreaker(name = "rentalCompanyServiceCB", fallbackMethod = "fallbackGetAllCompanies")
    public List<RentalCompany> getAllCompanies() {
        return rentalCompanyClient.getAllCompanies();
    }

    public List<RentalCompany> fallbackGetAllCompanies(Throwable t) {
        System.err.println("Fallback triggered for getAllCompanies: " + t.getMessage());
        return List.of(); // empty or default list
    }

}
