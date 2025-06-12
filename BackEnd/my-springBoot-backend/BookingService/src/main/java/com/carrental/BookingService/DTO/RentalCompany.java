package com.carrental.BookingService.DTO;

import jakarta.persistence.Column;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class RentalCompany {
    private Integer companyId;
    private String companyName;
    private String address;
    private String city;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String phone;
    private String status = "active"; // default 'active'
    private LocalDateTime createdAt = LocalDateTime.now();
}
