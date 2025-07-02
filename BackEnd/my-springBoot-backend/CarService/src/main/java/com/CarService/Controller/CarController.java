package com.CarService.Controller;


import com.CarService.Entity.Car;
import com.CarService.Entity.CarDto;
import com.CarService.Service.CarService;
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

    @GetMapping("/companyid/{companyId}")
    public List<Car> getCarByCompanyId(@PathVariable int companyId) {
        return carService.getCarByCompanyId(companyId);
    }

    @GetMapping("/verified/companyid/{companyid}")
    public List<Car> getValidCarByCompanyId(@PathVariable int companyId) {
        return carService.getValidCarByCompanyId(companyId);
    }


    @PostMapping
    public ResponseEntity<Car> addCar(@RequestBody CarDto carDto) {
        System.out.println("=== DEBUG: Controller received CarDto ===");
        System.out.println("Car ID: " + carDto.getCarId());
        System.out.println("Make: " + carDto.getMake());
        System.out.println("Model: " + carDto.getModel());
        System.out.println("RCbook: " + carDto.getRCbook());
        System.out.println("All DTO fields: " + carDto.toString());
        System.out.println("========================================");
        
        // Map CarDto to Car entity
        Car car = new Car();
        car.setCarId(carDto.getCarId());
        car.setCompanyId(carDto.getCompanyId());
        car.setMake(carDto.getMake());
        car.setModel(carDto.getModel());
        car.setYear(carDto.getYear());
        car.setCategory(carDto.getCategory());
        car.setDailyRate(carDto.getDailyRate());
        car.setFuelType(carDto.getFuelType());
        car.setSeatingCapacity(carDto.getSeatingCapacity());
        car.setFeatures(carDto.getFeatures());
        car.setImageUrls(carDto.getImageUrls());
        car.setStatus(carDto.getStatus());
        car.setRCbook(carDto.getRCbook()); // This is the key mapping!
        
        System.out.println("=== DEBUG: Mapped to Car entity ===");
        System.out.println("Car RCbook: " + car.getRCbook());
        System.out.println("================================");
        
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





}

