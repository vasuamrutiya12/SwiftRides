package com.SearchService.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RentalCompany {
    private Integer companyId;
    private String companyName;
    private String address;
    private String city;
    private double latitude;
    private double longitude;
    private String phone;
    private String status;
    private LocalDateTime createdAt;
}

