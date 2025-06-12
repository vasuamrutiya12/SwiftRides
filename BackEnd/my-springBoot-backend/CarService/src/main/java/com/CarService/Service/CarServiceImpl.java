package com.CarService.Service;

import com.CarService.Entity.Car;
import com.CarService.Entity.CarReview;
import com.CarService.Repository.CarRepository;
import com.CarService.dto.ReviewDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

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
    public Car addCar(Car car) {
        return carRepository.save(car);
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
        car.setStatus("available");

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
    public Car updateCarRating(Integer carId, ReviewDto reviewDto) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found with id: " + carId));

        CarReview carReview = car.getCarReview();
        if (carReview == null) {
            carReview = new CarReview();
            car.setCarReview(carReview);
        }

        // Initialize lists if null
        if (carReview.getComments() == null) {
            carReview.setComments(new ArrayList<>());
        }
        if (carReview.getRating() == null) {
            carReview.setRating(new ArrayList<>());
        }
        if (carReview.getReviewIds() == null) {
            carReview.setReviewIds(new ArrayList<>());
        }

        // Append the new review
        carReview.getComments().add(reviewDto.getComment());
        carReview.getRating().add(reviewDto.getRating());
        carReview.getReviewIds().add(System.currentTimeMillis()); // Or use proper review ID

        System.out.println("New Rating: " + reviewDto.getRating() + ", Comment: " + reviewDto.getComment());
        return carRepository.save(car);
    }


    @Override
    public ResponseEntity<Integer> getCarsCountByCompanyId(Integer companyId) {
        long count = carRepository.count();
        return ResponseEntity.ok((int) count);
    }

    @Override
    public long getBookedCarCount(String status) {
        return carRepository.countByStatus(status);
    }

    @Override
    public long getReviewsCount() {
        List<Car> cars = carRepository.findAll();
        long totalComments = 0;

        for (Car car : cars) {
            if (car.getCarReview() != null && car.getCarReview().getComments() != null) {
                totalComments += car.getCarReview().getComments().size();
            }
        }

        return totalComments;
    }


    @Override
    public double getReviewsAvg(Integer companyId) {
        List<Car> cars = getCarByCompanyId(companyId);

        // Flatten all ratings from all cars into a single stream
        DoubleSummaryStatistics stats = cars.stream()
                .map(Car::getCarReview)
                .filter(Objects::nonNull)
                .map(CarReview::getRating)
                .filter(Objects::nonNull)
                .flatMap(List::stream)
                .mapToDouble(Double::doubleValue)
                .summaryStatistics();

        // Returning average as a rounded long
        return stats.getAverage();
    }


}
