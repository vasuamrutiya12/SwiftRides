package com.SearchService.client;

import com.SearchService.dto.RentalCompany;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "rental-company-service")
public interface RentalCompanyClient {
    @GetMapping("/api/rental-company")
    List<RentalCompany> getAllCompanies();
}
