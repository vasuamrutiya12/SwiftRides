package com.UserService.client;

import com.UserService.dto.RentalCompanyDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class RentalCompanyClientFallback implements RentalCompanyClient {
    @Override
    public ResponseEntity<Void> registerRentalCompany(RentalCompanyDto rentalCompanyDto) {
        // Log fallback
        System.out.println("RentalCompanyService is down. Fallback activated.");
        return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
    }
}
