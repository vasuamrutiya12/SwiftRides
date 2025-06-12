package com.RentalCompaniesService.client;

import com.RentalCompaniesService.Dto.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "inventory-service")
public interface InventoryClient {

    @GetMapping("/api/inventory/car/{carId}/return")
    InventoryDto returnCar(@PathVariable("carId") Integer carId);

}


