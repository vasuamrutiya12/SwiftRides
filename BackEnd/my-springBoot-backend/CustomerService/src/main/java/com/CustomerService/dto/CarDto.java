package com.CustomerService.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarDto {
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
    private Double rating;
    private List<String> comments;
}
