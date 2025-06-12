package com.carrental.BookingService.Entity;



import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Inventory {

    private Integer id;

    private int carId;
    private String status; // available, booked, maintenance

    private LocalDateTime fromDate;
    private LocalDateTime toDate;

    private LocalDateTime lastUpdated;
}
