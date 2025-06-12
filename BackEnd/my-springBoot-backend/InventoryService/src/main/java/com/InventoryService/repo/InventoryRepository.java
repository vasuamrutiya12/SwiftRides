package com.InventoryService.repo;


import com.InventoryService.model.InventoryRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface InventoryRepository extends JpaRepository<InventoryRecord, Long> {

    List<InventoryRecord> findByCarIdAndStatusInAndToDateAfterAndFromDateBefore(
            int carId, List<String> statuses, LocalDateTime from, LocalDateTime to);

    List<InventoryRecord> findByStatusAndToDateBefore(String status, LocalDateTime time);

    List<InventoryRecord> findTopByCarIdAndStatusOrderByToDateDesc(int carId, String status);

}

