package com.InventoryService.controller;

import com.InventoryService.dto.CarStatusUpdateRequest;
import com.InventoryService.model.InventoryRecord;
import com.InventoryService.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @PostMapping("/car/{carId}/status")
    public ResponseEntity<InventoryRecord> updateStatus(
            @PathVariable("carId") Integer carId,
            @RequestBody CarStatusUpdateRequest request) {

        InventoryRecord record = inventoryService.updateAvailability(
                carId,
                request.getStatus(),
                request.getFrom(),
                request.getTo()
        );

        return ResponseEntity.ok(record);
    }


    @PostMapping("/car/{carId}/check-availability")
    public ResponseEntity<Boolean> checkAvailability(
            @PathVariable("carId") Integer carId,
            @RequestBody CarStatusUpdateRequest request) {

        boolean available = inventoryService.isCarAvailable(
                carId,
                request.getFrom(),
                request.getTo());
        return ResponseEntity.ok(available);
    }

    @GetMapping("/car/{carId}/return")
    public ResponseEntity<InventoryRecord> returnCar(@PathVariable("carId") Integer carId) {
        InventoryRecord updated = inventoryService.markCarAsReturned(carId);
        return ResponseEntity.ok(updated);
    }
}

