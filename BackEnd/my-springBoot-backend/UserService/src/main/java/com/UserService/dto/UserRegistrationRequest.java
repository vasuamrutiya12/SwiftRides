package com.UserService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationRequest {
    private UserDto user;
    private RentalCompanyDto rentalCompany;
    private CustomerDto customer;
}
