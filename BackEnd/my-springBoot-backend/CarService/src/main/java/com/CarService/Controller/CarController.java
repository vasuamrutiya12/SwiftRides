package com.CarService.Controller;


import com.CarService.Entity.Car;
import com.CarService.Service.CarService;
import com.CarService.dto.ReviewDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@RestController
@RequestMapping("/api/cars")
public class CarController {

    private final CarService carService;

    @Autowired
    public CarController(CarService carService) {
        this.carService = carService;
    }

    @GetMapping
    public ResponseEntity<List<Car>> getAllCars() {
        List<Car> cars = carService.getAllCars();
        return ResponseEntity.ok(cars);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Car> getCarById(@PathVariable int id) {
        Optional<Car> carOptional = carService.getCarById(id);
        return carOptional.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/companyid/{companyid}")
    public List<Car> getCarByCompanyId(@PathVariable int companyid) {
        return carService.getCarByCompanyId(companyid);
    }


    @PostMapping
    public ResponseEntity<Car> addCar(@RequestBody Car car) {
        return ResponseEntity.ok(carService.addCar(car));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Car> updateCar(@PathVariable int id, @RequestBody Car carDetails) {
        try {
            Car updatedCar = carService.updateCar(id, carDetails);
            return ResponseEntity.ok(updatedCar);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable int id) {
        try {
            carService.deleteCar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Car> updateCarStatus(@PathVariable("id") int carId,
                                               @RequestBody Car statusDto) {
        Car updatedCar = carService.updateCarStatus(carId, statusDto.getStatus());
        return ResponseEntity.ok(updatedCar);
    }

    @PutMapping("/{carId}/review")
    public ResponseEntity<?> updateCarRating(@PathVariable("carId") Integer carId,
                                               @RequestBody ReviewDto reviewDto) {
        Car updatedCar = carService.updateCarRating(carId, reviewDto);
        return ResponseEntity.ok("Add review");
    }

    @GetMapping("/total/companyId/{companyId}")
    public ResponseEntity<Integer> findTotalCars(@PathVariable("companyId") Integer companyId){
        ResponseEntity<Integer> totalCars = carService.getCarsCountByCompanyId(companyId);
        return totalCars;
    }

    @GetMapping("/count/status/{status}")
    public ResponseEntity<Long> getBookedCarsCount(@PathVariable("status") String status ) {
        long count = carService.getBookedCarCount(status );
        return ResponseEntity.ok(count);
    }


    @GetMapping("/reviews/count")
    public ResponseEntity<Long> getReviewsCount(){
        long reviewsCount = carService.getReviewsCount();
        return ResponseEntity.ok(reviewsCount);
    }

    @GetMapping("/companyId/{companyId}/average-rating")
    public ResponseEntity<Double> getReviewsAvg(@PathVariable("companyId") Integer companyId){
        double reviewsAvg = carService.getReviewsAvg(companyId);
        return ResponseEntity.ok(reviewsAvg);
    }


}

