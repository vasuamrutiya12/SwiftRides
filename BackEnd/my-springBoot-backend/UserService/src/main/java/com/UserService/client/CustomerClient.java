package com.UserService.client;

import com.UserService.dto.CustomerDto;
import com.UserService.dto.RentalCompanyDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "customer-service", fallback = CustomerClientFallback.class)
public interface CustomerClient {

    @PostMapping("/api/customers")
    ResponseEntity<Void> registercustomer(@RequestBody CustomerDto customerDto);
}

