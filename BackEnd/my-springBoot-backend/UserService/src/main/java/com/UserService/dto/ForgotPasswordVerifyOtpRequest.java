package com.UserService.dto;

import lombok.Data;

@Data
public class ForgotPasswordVerifyOtpRequest {
    private String email;
    
   private String otp;
}
