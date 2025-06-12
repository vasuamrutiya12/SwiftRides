package com.carrental.BookingService.Feign;

import com.carrental.BookingService.DTO.CarStatusUpdateRequest;
import com.carrental.BookingService.Entity.Inventory;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "inventory-service")
public interface InventoryClient {

    @PostMapping("/api/inventory/car/{carId}/status")
    Inventory updateCarStatus(@PathVariable("carId") Integer carId,
                              @RequestBody CarStatusUpdateRequest request);


    @PostMapping("/api/inventory/car/{carId}/check-availability")
    boolean checkCarAvailability(@PathVariable("carId") Integer carId,
                                 @RequestBody CarStatusUpdateRequest request);
}

