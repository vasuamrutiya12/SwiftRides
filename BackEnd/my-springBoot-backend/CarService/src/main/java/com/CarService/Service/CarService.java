package com.CarService.Service;

import com.CarService.Entity.Car;
import com.CarService.dto.ReviewDto;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

public interface CarService {
    List<Car> getAllCars();

    Optional<Car> getCarById(int id);

    List<Car> getCarByCompanyId(int companyId);

    Car addCar(Car car);

    Car addCarByCompany(int companyId,Car car);

    Car updateCar(int id, Car carDetails);

    void deleteCar(int id);

    Car updateCarStatus(int carId, String status);

    Car updateCarRating(Integer carId, ReviewDto reviewDto);

    ResponseEntity<Integer> getCarsCountByCompanyId(Integer companyId);

    long getBookedCarCount(String status);

    long getReviewsCount();

    double getReviewsAvg(Integer companyId);
}