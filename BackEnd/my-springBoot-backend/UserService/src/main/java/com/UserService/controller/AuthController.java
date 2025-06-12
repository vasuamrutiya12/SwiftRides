package com.UserService.controller;

import com.UserService.dto.*;
import com.UserService.entity.User;
import com.UserService.service.AuthService;
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

//    @PostMapping("/register")
//    public ResponseEntity<String> addNewUser(@RequestBody UserRegistrationRequest userRegistrationRequest) {
//        return service.registerUser(userRegistrationRequest);
//    }
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
            Map<String, String> response = new HashMap<>();
            response.put("token", service.generateToken(authRequest.getEmail()));
            response.put("email", authRequest.getEmail());
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

}
