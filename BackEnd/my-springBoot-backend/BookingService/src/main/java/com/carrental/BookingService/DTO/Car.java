package com.carrental.BookingService.DTO;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class Car {
    private Integer carId;
    private Integer companyId;
    private String make;
    private String model;
    private int year;
    private String category;
    private double dailyRate;
    private String fuelType;
    private int seatingCapacity;
    private List<String> features;
    private List<String> imageUrls;
    private String status;
    private LocalDateTime createdAt;
}
