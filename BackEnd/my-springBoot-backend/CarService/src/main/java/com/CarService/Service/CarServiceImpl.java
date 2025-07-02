package com.CarService.Service;

import com.CarService.Entity.Car;
import com.CarService.Repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CarServiceImpl implements CarService {
    private final CarRepository carRepository;

    @Autowired
    public CarServiceImpl(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    @Override
    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    @Override
    public Optional<Car> getCarById(int id) {
        return carRepository.findById(id);
    }

    @Override
    public List<Car> getCarByCompanyId(int companyId) {
        return carRepository.findByCompanyId(companyId);
    }

    @Override
    public List<Car> getValidCarByCompanyId(int companyId) {
        List<Car> cars= carRepository.findByCompanyId(companyId);
        return cars.stream()
                .filter(car -> !"PENDING".equalsIgnoreCase(car.getStatus()))
                .collect(Collectors.toList());

    }


    @Override
    public Car addCar(Car car) {
        System.out.println("=== DEBUG: Adding car ===");
        System.out.println("Car ID: " + car.getCarId());
        System.out.println("Make: " + car.getMake());
        System.out.println("Model: " + car.getModel());
        System.out.println("RCbook: " + car.getRCbook());
        System.out.println("All car fields: " + car.toString());
        System.out.println("=========================");
        
        Car savedCar = carRepository.save(car);
        
        System.out.println("=== DEBUG: Saved car ===");
        System.out.println("Saved Car ID: " + savedCar.getCarId());
        System.out.println("Saved RCbook: " + savedCar.getRCbook());
        System.out.println("=========================");
        
        return savedCar;
    }

    @Override
    public Car addCarByCompany(int companyId, Car car) {
        if (car.getCarId() != 0) {
            throw new IllegalArgumentException("New car should not have a predefined ID.");
        }

        // Optional: verify company exists
        // rentalCompanyRepo.findById(companyId).orElseThrow(() -> new RuntimeException("Company not found"));

        car.setCompanyId(companyId);
        car.setCreatedAt(LocalDateTime.now());
        car.setStatus("PENDING");

        return carRepository.save(car);
    }


    @Override
    public Car updateCar(int id, Car carDetails) {
        return carRepository.findById(id).map(car -> {
            if (carDetails.getCompanyId() != 0) {
                car.setCompanyId(carDetails.getCompanyId());
            }
            if (carDetails.getMake() != null && !carDetails.getMake().isEmpty()) {
                car.setMake(carDetails.getMake());
            }
            if (carDetails.getModel() != null && !carDetails.getModel().isEmpty()) {
                car.setModel(carDetails.getModel());
            }
            if (carDetails.getYear() != 0) {
                car.setYear(carDetails.getYear());
            }
            if (carDetails.getCategory() != null && !carDetails.getCategory().isEmpty()) {
                car.setCategory(carDetails.getCategory());
            }
            if (carDetails.getDailyRate() != 0) {
                car.setDailyRate(carDetails.getDailyRate());
            }
            if (carDetails.getFuelType() != null && !carDetails.getFuelType().isEmpty()) {
                car.setFuelType(carDetails.getFuelType());
            }
            if (carDetails.getSeatingCapacity() != 0) {
                car.setSeatingCapacity(carDetails.getSeatingCapacity());
            }
            if (carDetails.getFeatures() != null && !carDetails.getFeatures().isEmpty()) {
                car.setFeatures(carDetails.getFeatures());
            }
            if (carDetails.getImageUrls() != null && !carDetails.getImageUrls().isEmpty()) {
                car.setImageUrls(carDetails.getImageUrls());
            }
            if (carDetails.getStatus() != null && !carDetails.getStatus().isEmpty()) {
                car.setStatus(carDetails.getStatus());
            }
            if (carDetails.getRCbook() != null && !carDetails.getRCbook().isEmpty()) {
                car.setRCbook(carDetails.getRCbook());
            }

            return carRepository.save(car);
        }).orElseThrow(() -> new RuntimeException("Car not found with id " + id));
    }


    @Override
    public void deleteCar(int id) {
        carRepository.deleteById(id);
    }

    @Override
    public Car updateCarStatus(int carId, String status) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found with ID: " + carId));

        car.setStatus(status);
        carRepository.save(car);

        return car;// assuming you use a mapper
    }

    @Override
    public ResponseEntity<Integer> getCarsCountByCompanyId(Integer companyId) {
        long count = carRepository.countByCompanyId(companyId);
        return ResponseEntity.ok((int) count);
    }

    @Override
    public long getBookedCarCount(String status) {
        return carRepository.countByStatus(status);
    }







}
