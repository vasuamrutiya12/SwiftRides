package com.UserService.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RentalCompanyDto {
    private Integer companyId; // same as userId
    private String companyName;
    private String email;
    private String address;
    private String city;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String phoneNumber;
    private Integer userId;
}

