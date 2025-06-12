package com.InventoryService.model;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InventoryRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private int carId;
    private String status; // available, booked, maintenance

    private LocalDateTime fromDate;
    private LocalDateTime toDate;

    private LocalDateTime lastUpdated;
}

