package com.SearchService.client;

import com.SearchService.dto.CarStatusUpdateRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "inventory-service")
public interface InventoryClient {
    @PostMapping("/api/inventory/car/{carId}/check-availability")
    Boolean checkAvailability(@PathVariable("carId") Integer carId,
                              @RequestBody CarStatusUpdateRequest request);

}


