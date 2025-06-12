package com.UserService.dto;

import lombok.Data;

@Data
public class OTPSendDTO {
    private String email;
    private String otp;
    private UserRegistrationRequest registrationData;
}
