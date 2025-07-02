package com.UserService.service;

import com.UserService.client.NotificationClient;
import com.UserService.dto.ForgotPasswordResetRequest;
import com.UserService.dto.ForgotPasswordSendOtpRequest;
import com.UserService.dto.ForgotPasswordVerifyOtpRequest;
import com.UserService.dto.UserRegistrationRequest;
import com.UserService.entity.User;
import com.UserService.repository.UserCredentialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class ForgotPasswordService {
    @Autowired
    private UserCredentialRepository userRepository;
    
    @Autowired
    private NotificationClient notificationClient;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public ResponseEntity<String> sendOtp(ForgotPasswordSendOtpRequest request) {
        // Check if user exists
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (!userOptional.isPresent()) {
            throw new RuntimeException("User not found with email: " + request.getEmail());
        }
        try {
            // Send OTP
            User user = userOptional.get();
            ResponseEntity<String> otpResponse = notificationClient.sendOTP(user.getEmail());
            System.out.println(otpResponse);
            if (otpResponse.getStatusCode() == HttpStatus.OK) {
                // Store registration data temporarily
                return ResponseEntity.ok("OTP sent to your email. ");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Failed to send OTP. Please try again.");
            }

        } catch (Exception e) {
            System.err.println("Failed to send OTP: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send OTP. Please try again.");
        }
    }
    
    public String verifyOtp(ForgotPasswordVerifyOtpRequest request) {
        // Check if user exists
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (!userOptional.isPresent()) {
            throw new RuntimeException("User not found with email: " + request.getEmail());
        }
        try {
            ResponseEntity<String> validationResponse = notificationClient.validateOTP(request.getEmail(), request.getOtp());

            if (validationResponse.getStatusCode() != HttpStatus.OK) {
                throw new RuntimeException("Invalid OTP");
            } else {
                return "Otp verified and correct";
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to verify OTP: " + e.getMessage());
        }
    }
    
    public String resetPassword(ForgotPasswordResetRequest request) {
        // Check if user exists
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (!userOptional.isPresent()) {
            throw new RuntimeException("User not found with email: " + request.getEmail());
        }
        if(!request.isVerified()){
            throw new RuntimeException("User not verified by otp  with email: " + request.getEmail());
        }
        
        // Update password
        User user = userOptional.get();
        String encodedPassword = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(encodedPassword);
        userRepository.save(user);
        
        return "Password reset successfully";
    }
    
//    public String resendOtp(ForgotPasswordSendOtpRequest request) {
//        // Check if user exists
//        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
//        if (!userOptional.isPresent()) {
//            throw new RuntimeException("User not found with email: " + request.getEmail());
//        }
//
//        // Resend OTP via Notification Service
//        OtpRequest otpRequest = new OtpRequest(request.getEmail(), "FORGOT_PASSWORD");
//        String response = notificationServiceClient.resendOtp(otpRequest);
//
//        return "OTP resent successfully";
//    }
}
