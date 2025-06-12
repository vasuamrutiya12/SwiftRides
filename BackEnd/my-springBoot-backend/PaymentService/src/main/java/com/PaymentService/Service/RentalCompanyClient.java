package com.PaymentService.Service;

import com.PaymentService.DTOs.CompanyDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "RENTAL-COMPANY-SERVICE")
public interface RentalCompanyClient {
    @GetMapping("/api/rental-company/{id}")
    CompanyDTO getCompanyById(@PathVariable("id") Integer companyId);
}

