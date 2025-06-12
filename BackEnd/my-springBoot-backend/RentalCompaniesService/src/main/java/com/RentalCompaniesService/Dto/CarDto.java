package com.RentalCompaniesService.Dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarDto {
    private int carId;
    private int companyId;
    private String make;
    private String model;
    private int year;
    private String category;
    private double dailyRate;
    private String fuelType;
    private int seatingCapacity;
    private List<String> features;
    private List<String> imageUrls;
    private Long rating;

}

