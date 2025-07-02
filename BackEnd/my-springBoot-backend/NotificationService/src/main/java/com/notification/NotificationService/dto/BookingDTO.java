package com.notification.NotificationService.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class BookingDTO {
    private int bookingId;
    private int customerId;
    private int carId;
    private int companyID;
    private LocalDate pickupDate;
    private LocalDate returnDate;
    private int totalDays;
    private double totalAmount;
    private String status;
    private String bookingReference;
}