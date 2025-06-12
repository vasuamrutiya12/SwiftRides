package com.UserService.client;

import com.UserService.dto.CustomerDto;
import com.UserService.dto.RentalCompanyDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class CustomerClientFallback implements CustomerClient {

    @Override
    public ResponseEntity<Void> registercustomer(CustomerDto customerDto) {
        // Log fallback
        System.out.println("CustomerService is down. Fallback activated.");
        return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
    }
}
