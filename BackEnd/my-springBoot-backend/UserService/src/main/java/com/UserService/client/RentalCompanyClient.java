package com.UserService.client;

import com.UserService.dto.RentalCompanyDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "rental-company-service", fallback = RentalCompanyClientFallback.class)
public interface RentalCompanyClient {

    @PostMapping("/api/rental-company")
    ResponseEntity<Void> registerRentalCompany(@RequestBody RentalCompanyDto rentalCompanyDto);
}

