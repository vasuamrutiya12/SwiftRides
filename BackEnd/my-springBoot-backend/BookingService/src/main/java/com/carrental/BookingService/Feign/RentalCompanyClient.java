package com.carrental.BookingService.Feign;

import com.carrental.BookingService.DTO.RentalCompany;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "rental-company-service")  // Must match Eureka registration
public interface RentalCompanyClient {
    @GetMapping("/api/rental-company/{id}")
    RentalCompany getCompanyById(@PathVariable("id") Integer id);
}


