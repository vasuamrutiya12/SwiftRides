package com.carrental.BookingService.Service;

import com.carrental.BookingService.DTO.Car;
import com.carrental.BookingService.DTO.RentalCompany;
import com.carrental.BookingService.Feign.CarClient;
import com.carrental.BookingService.Feign.RentalCompanyClient;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class ResilientService {

    private final CarClient carClient;
    private final RentalCompanyClient rentalCompanyClient;

    @Autowired
    public ResilientService(CarClient carClient, RentalCompanyClient rentalCompanyClient) {
        this.carClient = carClient;
        this.rentalCompanyClient = rentalCompanyClient;
    }

    @CircuitBreaker(name = "carServiceCB", fallbackMethod = "fallbackGetCarById")
    public Car getCarById(int carId) {
        return carClient.getCarById(carId);
    }

    public Car fallbackGetCarById(int carId, Throwable t) {
        System.err.println("Fallback triggered for getCarById: " + t.getMessage());
        return null; // Or return a default Car object if needed
    }

    @CircuitBreaker(name = "rentalCompanyServiceCB", fallbackMethod = "fallbackGetCompanyById")
    public RentalCompany getCompanyById(Integer id) {
        return rentalCompanyClient.getCompanyById(id);
    }

    public RentalCompany fallbackGetCompanyById(Integer id, Throwable t) {
        System.err.println("Fallback triggered for getCompanyById: " + t.getMessage());
        return null; // Or return a default RentalCompany object if needed
    }
}
