package com.UserService.controller;

import com.UserService.dto.*;
import com.UserService.entity.User;
import com.UserService.service.AuthService;
import com.UserService.service.ForgotPasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthService service;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register/initiate")
    public ResponseEntity<String> initiateRegistration(@RequestBody UserRegistrationRequest request) {
        return service.initiateUserRegistration(request);
    }

    @PostMapping("/register/verify")
    public ResponseEntity<?> verifyAndCompleteRegistration(@RequestBody OTPSendDTO otpRequest) {
        User user = service.verifyOTPAndCompleteRegistration(otpRequest);

        if (user != null) {
            Map<String, String> response = new HashMap<>();
            response.put("token", service.generateToken(user.getEmail()));
            response.put("email", user.getEmail());

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("OTP verification failed or registration issue");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> getToken(@RequestBody AuthRequest authRequest) {
        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
        );

        if (authenticate.isAuthenticated()) {
            User user = service.getUserByEmail(authRequest.getEmail());
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }
            Map<String, String> response = new HashMap<>();
            response.put("token", service.generateToken(authRequest.getEmail()));
            response.put("email", authRequest.getEmail());
            response.put("role", String.valueOf(user.getRole()));
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid access");
        }
    }

    @PostMapping("/user/email")
    public Integer getCustomerWithBookingByEmail(@RequestBody EmailRequest email){
        return service.getUserIdByEmail(email.getEmail());
    }


    @GetMapping("/user/{userId}")
    public UserDto GetUserById(@PathVariable("userId") int userId) {
        return service.getUserById(userId);
    }

    @DeleteMapping("/user/{userId}")
    public void deleteUserById(@PathVariable("userId") int userId) {
        service.deleteUserById(userId);
    }


    @Autowired
    private ForgotPasswordService forgotPasswordService;

    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody ForgotPasswordSendOtpRequest request) {
        try {
            ResponseEntity<String> result = forgotPasswordService.sendOtp(request);
            return ResponseEntity.ok(result.getBody());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to send OTP: " + e.getMessage());
        }
    }

    @PostMapping("/forgot-password/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody ForgotPasswordVerifyOtpRequest request) {
        try {
            String result = forgotPasswordService.verifyOtp(request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to verify OTP: " + e.getMessage());
        }
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<String> resetPassword(@RequestBody ForgotPasswordResetRequest request) {
        try {
            String result = forgotPasswordService.resetPassword(request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to reset password: " + e.getMessage());
        }
    }

    @PostMapping("/forgot-password/resend-otp")
    public ResponseEntity<String> resendOtp(@RequestBody ForgotPasswordSendOtpRequest request) {
        try {
            ResponseEntity<String> result = forgotPasswordService.sendOtp(request);
            return ResponseEntity.ok(result.getBody());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to resend OTP: " + e.getMessage());
        }
    }

    @PostMapping("/register/resend-otp")
    public ResponseEntity<String> resendRegistrationOtp(@RequestBody EmailRequest request) {
        return service.resendRegistrationOtp(request.getEmail());
    }
}
