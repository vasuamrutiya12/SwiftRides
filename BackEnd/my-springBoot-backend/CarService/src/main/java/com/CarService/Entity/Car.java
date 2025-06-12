package com.CarService.Entity;

import com.CarService.dto.ReviewDto;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;


    @Entity
    @Table(name = "Cars")
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public class Car {

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        @Column(name = "id", updatable = false, nullable = false)
        private int carId;

        @Column(name = "company_id", nullable = false)
        private int companyId;

        @Column(name = "make", nullable = false, length = 100)
        private String make;

        @Column(name = "model", nullable = false, length = 100)
        private String model;

        @Column(name = "year", nullable = false)
        private int year;

        @Column(name = "category", nullable = false, length = 50)
        private String category;

        @Column(name = "daily_rate", nullable = false)
        private double dailyRate;

        @Column(name = "fuel_type", nullable = false)
        private String fuelType;

        @Column(name = "seating_capacity", nullable = false)
        private int seatingCapacity;

        @ElementCollection
        @CollectionTable(name = "car_features", joinColumns = @JoinColumn(name = "car_id"))
        @Column(name = "feature")
        private List<String> features;

        @ElementCollection
        @CollectionTable(name = "car_image_urls", joinColumns = @JoinColumn(name = "car_id"))
        @Column(name = "image_url")
        private List<String> imageUrls;

        @Column(name = "status", length = 50, nullable = false)
        private String status = "available";

        @Column(name = "created_at", nullable = false, updatable = false)
        private LocalDateTime createdAt = LocalDateTime.now();

        @Embedded
        private CarReview carReview;


    }
