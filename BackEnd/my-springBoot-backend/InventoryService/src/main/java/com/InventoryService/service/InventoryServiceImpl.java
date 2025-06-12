package com.InventoryService.service;

import com.InventoryService.client.CarServiceClient;
import com.InventoryService.dto.CarStatusUpdateDto;
import com.InventoryService.model.InventoryRecord;
import com.InventoryService.repo.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InventoryServiceImpl implements InventoryService {

    private static final int GRACE_PERIOD_MINUTES = 10;  // Grace period after booking end

    @Autowired
    private InventoryRepository inventoryRepo;

    @Autowired
    private CarServiceClient carClient;

    @Override
    public InventoryRecord updateAvailability(int carId, String status, LocalDateTime from, LocalDateTime to) {
        InventoryRecord record = new InventoryRecord();
        record.setCarId(carId);
        record.setStatus(status.toLowerCase());
        record.setFromDate(from);
        record.setToDate(to);
        record.setLastUpdated(LocalDateTime.now());

        inventoryRepo.save(record);

        carClient.updateCarStatus(carId, new CarStatusUpdateDto(carId, status.toLowerCase()));
        return record;
    }

    @Override
    public boolean isCarAvailable(int carId, LocalDateTime from, LocalDateTime to) {
        List<InventoryRecord> conflicts = inventoryRepo.findByCarIdAndStatusInAndToDateAfterAndFromDateBefore(
                carId,
                List.of("booked", "maintenance", "overdue"),
                from,
                to
        );
        System.out.println(conflicts);
        return conflicts.isEmpty();
    }

    @Override
    public InventoryRecord markCarAsReturned(int carId) {
        List<InventoryRecord> records = inventoryRepo.findTopByCarIdAndStatusOrderByToDateDesc(carId, "booked");
        if (!records.isEmpty()) {
            InventoryRecord record = records.get(0);
            record.setStatus("available");
            record.setLastUpdated(LocalDateTime.now());
            inventoryRepo.save(record);
            carClient.updateCarStatus(carId, new CarStatusUpdateDto(carId, "available"));
            return record;
        }
        throw new RuntimeException("No active booking found for car ID " + carId);
    }

    @Scheduled(fixedRate = 60000) // runs every 1 minute
    public void autoReleaseCars() {
        LocalDateTime now = LocalDateTime.now();

        // Step 1: Find all booked cars whose booking ended before now (expired bookings)
        List<InventoryRecord> expired = inventoryRepo.findByStatusAndToDateBefore("booked", now);

        for (InventoryRecord record : expired) {
            LocalDateTime bookingEnd = record.getToDate();
            LocalDateTime overdueThreshold = bookingEnd.plusMinutes(GRACE_PERIOD_MINUTES);

            if (now.isAfter(overdueThreshold)) {
                // After grace period: mark as overdue
                record.setStatus("overdue");
                record.setLastUpdated(now);
                inventoryRepo.save(record);

                // TODO: Notify rental company/admin about overdue car return
                // notifyOverdueCar(record.getCarId());
            } else {
                // Within grace period, do nothing yet - wait for manual return or overdue status
            }
        }

        // Step 2: Auto-release cars marked as overdue for some time (optional)
        // For simplicity, immediately release cars that are overdue for more than grace period again (or some other policy)

        LocalDateTime overdueReleaseThreshold = now.minusMinutes(GRACE_PERIOD_MINUTES);
        List<InventoryRecord> overdueCars = inventoryRepo.findByStatusAndToDateBefore("overdue", overdueReleaseThreshold);

        for (InventoryRecord record : overdueCars) {
            record.setStatus("available");
            record.setLastUpdated(now);
            inventoryRepo.save(record);
            carClient.updateCarStatus(record.getCarId(), new CarStatusUpdateDto(record.getCarId(), "available"));

        }
    }

    // Optional notification method (example placeholder)
    /*
    private void notifyOverdueCar(int carId) {
        // send email, SMS, push notification etc.
    }
    */
}
