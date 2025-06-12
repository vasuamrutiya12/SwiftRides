package com.RentalCompaniesService.client;

import com.RentalCompaniesService.Dto.CarDto;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CarServiceClientFallback implements CarServiceClient {


    @Override
    public List<CarDto> getCarsofCompany(Integer companyId) {
        return List.of();
    }

    @Override
    public CarDto registerCar( CarDto request) {
        return null;
    }

    @Override
    public ResponseEntity<CarDto> updateCar(int id, CarDto carDetails) {
        return null;
    }

    @Override
    public ResponseEntity<Integer> findTotalCars(Integer companyId) {
        return null;
    }
}

