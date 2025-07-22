package com.UserService.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDto {
    private Integer customerId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String address;
    private String drivingLicenseNumber;
    private Integer userId;
    private LocalDate dateOfBirth ;
}

