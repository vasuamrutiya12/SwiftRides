package com.SearchService.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class SearchResult {
    private Long carId;
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

    private String companyName;
    private String city;

    private LocalDateTime pickupDate;
    private LocalDateTime returnDate;
}
