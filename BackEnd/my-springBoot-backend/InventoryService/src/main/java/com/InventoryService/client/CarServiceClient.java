package com.InventoryService.client;

import com.InventoryService.dto.CarStatusUpdateDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "car-service", url = "http://localhost:8082/api/cars")
public interface CarServiceClient {
    @PutMapping("/{carId}/status")
    void updateCarStatus(@PathVariable("carId") int carId,
                         @RequestBody CarStatusUpdateDto request);
}



