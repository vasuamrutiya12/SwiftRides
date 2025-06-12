package com.PaymentService.DTOs;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingDTO {
    private int bookingId;
    private int customerId;
    private int carId;
    private int companyId;
    private LocalDate pickupDate;
    private LocalDate returnDate;
    private int totalDays;
    private double totalAmount;
    private String status;
    private String bookingReference;
}

