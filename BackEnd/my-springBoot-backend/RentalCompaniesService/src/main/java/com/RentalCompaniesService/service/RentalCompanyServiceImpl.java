package com.RentalCompaniesService.service;

import com.RentalCompaniesService.Dto.CarDto;
import com.RentalCompaniesService.Dto.InventoryDto;
import com.RentalCompaniesService.Dto.ReviewDto;
import com.RentalCompaniesService.Repo.RentalCompanyRepo;
import com.RentalCompaniesService.client.CarServiceClient;
import com.RentalCompaniesService.client.InventoryClient;
import com.RentalCompaniesService.client.ReviewServiceClient;
import com.RentalCompaniesService.model.RentalCompany;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RentalCompanyServiceImpl implements RentalCompanyService {

    @Autowired
    private RentalCompanyRepo rentalCompanyRepository;

    @Autowired
    private CarServiceClient carServiceClient;

    @Autowired
    private InventoryClient inventoryClient;

    @Autowired
    private ReviewServiceClient reviewServiceClient;
    @Override
    public RentalCompany getRentalCompanyById(Integer id) {
        RentalCompany rentalCompany = rentalCompanyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rental Company not found with ID: " + id));
        rentalCompany.setCars(carServiceClient.getCarsofCompany(rentalCompany.getCompanyId()));
        return rentalCompany;
    }
    @Override
    public RentalCompany createRentalCompany(RentalCompany rentalCompany) {
        if (rentalCompany.getUserId() == null || rentalCompany.getUserId().describeConstable().isEmpty()) {
            throw new IllegalArgumentException("User ID must be set for rental company");
        }
        return rentalCompanyRepository.save(rentalCompany);
    }

    @Override
    public List<RentalCompany> getAllRentalCompanies() {
        List<RentalCompany> companies = rentalCompanyRepository.findAll();
        return companies.stream().map(rentalCompany -> {
            rentalCompany.setCars(carServiceClient.getCarsofCompany(rentalCompany.getCompanyId()));
            return rentalCompany;
        }).collect(Collectors.toList());
    }


    @Override
    public RentalCompany updateRentalCompany(Integer id, RentalCompany updatedCompany) {
        RentalCompany existing = getRentalCompanyById(id);

        existing.setCompanyName(updatedCompany.getCompanyName());
        existing.setAddress(updatedCompany.getAddress());
        existing.setCity(updatedCompany.getCity());
        existing.setLatitude(updatedCompany.getLatitude());
        existing.setLongitude(updatedCompany.getLongitude());
        existing.setPhoneNumber(updatedCompany.getPhoneNumber());
        existing.setStatus(updatedCompany.getStatus());

        return rentalCompanyRepository.save(existing);
    }

    @Override
    public void deleteRentalCompany(Integer id) {
        RentalCompany existing = getRentalCompanyById(id);
        existing.setStatus("inactive"); // Soft delete
        rentalCompanyRepository.save(existing);
    }

    @Override
    public List<RentalCompany> findRentalCompaniesByCity(String city) {
        List<RentalCompany> companies = rentalCompanyRepository.findByCityIgnoreCase(city);
        return companies.stream().map(rentalCompany -> {
            rentalCompany.setCars(carServiceClient.getCarsofCompany(rentalCompany.getCompanyId()));
            return rentalCompany;
        }).collect(Collectors.toList());
    }


    @Override
    public void activateRentalCompany(Integer id) {
        RentalCompany existing = getRentalCompanyById(id);
        existing.setStatus("active");
        rentalCompanyRepository.save(existing);
    }

    @Override
    public void deactivateRentalCompany(Integer id) {
        RentalCompany existing = getRentalCompanyById(id);
        existing.setStatus("inactive");
        rentalCompanyRepository.save(existing);
    }

    @Override
    public CarDto registerCarForCompany(Integer id,CarDto request) {
        // Ensure the company exists and is active before registering a car
        RentalCompany company = getRentalCompanyById(id);
        if (!"active".equalsIgnoreCase(company.getStatus())) {
            throw new IllegalStateException("Cannot register car for an inactive company");
        }
        request.setCompanyId(company.getCompanyId());

        System.out.println("=== DEBUG: Forwarding to CarService ===");
        System.out.println("Car Make: " + request.getMake());
        System.out.println("Car Model: " + request.getModel());
        System.out.println("Car RCbook: " + request.getRCbook());
        System.out.println("All request fields: " + request.toString());
        System.out.println("======================================");

        return carServiceClient.registerCar(request);
    }

    @Override
    public CarDto updateCarDetails(int carId, CarDto carDetails) {
        ResponseEntity<CarDto> response = carServiceClient.updateCar(carId, carDetails);
        return response.getBody();
    }

    @Override
    public InventoryDto returnCar(Integer carId) {
        return inventoryClient.returnCar(carId);
    }

    @Override
    public ResponseEntity<Integer> getTotalCar(Integer id) {
        ResponseEntity<Integer> totalCar = carServiceClient.findTotalCars(id);
        return totalCar;
    }

    @Override
    public ResponseEntity<List<ReviewDto>> getAllReviewsById(int id) {
        ResponseEntity<List<ReviewDto>> AllReviews = reviewServiceClient.getAllReviews();
return AllReviews;

    }

    @Override
    public Long getCountOfComaponies() {
        return rentalCompanyRepository.count();
    }


}
