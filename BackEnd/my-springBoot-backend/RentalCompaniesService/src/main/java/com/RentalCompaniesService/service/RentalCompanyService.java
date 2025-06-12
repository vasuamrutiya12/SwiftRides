package com.RentalCompaniesService.service;

import com.RentalCompaniesService.Dto.CarDto;
import com.RentalCompaniesService.Dto.InventoryDto;
import com.RentalCompaniesService.Dto.ReviewDto;
import com.RentalCompaniesService.model.RentalCompany;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface RentalCompanyService {
    RentalCompany createRentalCompany(RentalCompany rentalCompany);

    List<RentalCompany> getAllRentalCompanies();

    RentalCompany getRentalCompanyById(Integer id);

    RentalCompany updateRentalCompany(Integer id, RentalCompany updatedCompany);

    void deleteRentalCompany(Integer id);

    List<RentalCompany> findRentalCompaniesByCity(String city);

    void activateRentalCompany(Integer id);

    void deactivateRentalCompany(Integer id);

    CarDto registerCarForCompany(Integer id,CarDto request);

    CarDto updateCarDetails(int carId, CarDto carDetails);

    InventoryDto returnCar(Integer carId);

    ResponseEntity<Integer> getTotalCar(Integer id);

    ResponseEntity<List<ReviewDto>> getAllReviewsById(int id);

    Long getCountOfComaponies();
}
