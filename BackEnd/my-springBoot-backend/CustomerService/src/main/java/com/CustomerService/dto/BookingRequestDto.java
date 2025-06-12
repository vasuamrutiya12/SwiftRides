package com.CustomerService.dto;

import jakarta.persistence.Column;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingRequestDto {
    private int bookingId;
    private int companyID;
    private int customerId;
    private int carId;
    private LocalDateTime pickupDate;
    private LocalDateTime returnDate;
    private int totalDays;
    private double totalAmount;
    private String status = "pending";
    private String bookingReference;
    private LocalDateTime createdAt = LocalDateTime.now();

    private CarDto car; // ✅ Nested car object
}
