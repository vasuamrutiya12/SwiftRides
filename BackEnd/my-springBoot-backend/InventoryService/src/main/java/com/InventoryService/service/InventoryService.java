package com.InventoryService.service;

import com.InventoryService.model.InventoryRecord;

import java.time.LocalDateTime;

public interface InventoryService {

    InventoryRecord updateAvailability(int carId, String status, LocalDateTime from, LocalDateTime to);
    boolean isCarAvailable(int carId, LocalDateTime from, LocalDateTime to);
    InventoryRecord markCarAsReturned(int carId);
    void autoReleaseCars();
}
