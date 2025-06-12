package com.RentalCompaniesService.controller;

import com.RentalCompaniesService.Dto.CarDto;
import com.RentalCompaniesService.Dto.InventoryDto;
import com.RentalCompaniesService.Dto.ReviewDto;
import com.RentalCompaniesService.model.RentalCompany;
import com.RentalCompaniesService.service.RentalCompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rental-company")
public class RentalCompanyController {

    private final RentalCompanyService rentalCompanyService;

    @Autowired
    public RentalCompanyController(RentalCompanyService rentalCompanyService) {
        this.rentalCompanyService = rentalCompanyService;
    }

    // Create a new rental company
    @PostMapping
    public ResponseEntity<RentalCompany> createRentalCompany(@RequestBody RentalCompany rentalCompany) {
        return ResponseEntity.ok(rentalCompanyService.createRentalCompany(rentalCompany));
    }

    // Get all rental companies
    @GetMapping
    public ResponseEntity<List<RentalCompany>> getAllRentalCompanies() {
        return ResponseEntity.ok(rentalCompanyService.getAllRentalCompanies());
    }

    // Get a rental company by ID
    @GetMapping("/{id}")
    public ResponseEntity<RentalCompany> getRentalCompanyById(@PathVariable Integer id) {
        return ResponseEntity.ok(rentalCompanyService.getRentalCompanyById(id));
    }

    // Update a rental company
    @PutMapping("/{id}")
    public ResponseEntity<RentalCompany> updateRentalCompany(@PathVariable Integer id, @RequestBody RentalCompany rentalCompany) {
        return ResponseEntity.ok(rentalCompanyService.updateRentalCompany(id, rentalCompany));
    }

    // Delete (soft delete / deactivate) a rental company
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRentalCompany(@PathVariable Integer id) {
        rentalCompanyService.deleteRentalCompany(id);
        return ResponseEntity.noContent().build();
    }

    // Search rental companies by city
    @GetMapping("/city/{city}")
    public ResponseEntity<List<RentalCompany>> findByCity(@PathVariable String city) {
        return ResponseEntity.ok(rentalCompanyService.findRentalCompaniesByCity(city));
    }

    // Activate a rental company
    @PutMapping("/{id}/activate")
    public ResponseEntity<Void> activateRentalCompany(@PathVariable Integer id) {
        rentalCompanyService.activateRentalCompany(id);
        return ResponseEntity.noContent().build();
    }

    // Deactivate a rental company
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateRentalCompany(@PathVariable Integer id) {
        rentalCompanyService.deactivateRentalCompany(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{companyId}/register-car")
    public ResponseEntity<CarDto> registerCar(@PathVariable Integer companyId,@RequestBody CarDto request) {
        CarDto registeredCar = rentalCompanyService.registerCarForCompany(companyId,request);
        return new ResponseEntity<>(registeredCar, HttpStatus.CREATED);
    }

    @PutMapping("/car/{carId}")
    public ResponseEntity<CarDto> updateCar(@PathVariable Integer carId,@RequestBody CarDto request) {
        CarDto updatedCar = rentalCompanyService.updateCarDetails(carId,request);
        return new ResponseEntity<>(updatedCar, HttpStatus.CREATED);
    }

    @GetMapping("/car/{carId}/return")
    public ResponseEntity<InventoryDto> returnCar(@PathVariable Integer carId){
        InventoryDto inventoryDto = rentalCompanyService.returnCar(carId);
        return new ResponseEntity<>(inventoryDto, HttpStatus.OK);
    }

    @GetMapping("/{id}/total-car")
    public ResponseEntity<Integer> totalCar(@PathVariable("id") Integer id){
        ResponseEntity<Integer> totalCar = rentalCompanyService.getTotalCar(id);
        return totalCar;
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<ReviewDto>> getAllReviewsById(@PathVariable("id") Integer id){
        ResponseEntity<List<ReviewDto>> reviews = rentalCompanyService.getAllReviewsById(id);
        return reviews;
    }

    @GetMapping("total")
    public ResponseEntity<Long> totalComapnies(){
        Long total = rentalCompanyService.getCountOfComaponies();
        return  ResponseEntity.ok(total);
    }

}
