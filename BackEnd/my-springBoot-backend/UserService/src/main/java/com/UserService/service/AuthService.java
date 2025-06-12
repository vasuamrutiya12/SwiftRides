package com.UserService.service;

import com.UserService.client.CustomerClient;
import com.UserService.client.NotificationClient;
import com.UserService.client.RentalCompanyClient;
import com.UserService.dto.*;
import com.UserService.entity.Role;
import com.UserService.entity.User;
import com.UserService.repository.UserCredentialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserCredentialRepository repository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private RentalCompanyClient rentalCompanyClient;
    @Autowired
    private CustomerClient customerClient;
    @Autowired
    private TemporaryRegistrationStorage temporaryStorage;
    @Autowired
    private NotificationClient notificationClient;


//    public ResponseEntity<String> registerUser(UserRegistrationRequest request) {
//        UserDto userDto = request.getUser();
//        RentalCompanyDto rentalCompanyDto = request.getRentalCompany();
//        CustomerDto customerDto = request.getCustomer();
//
//        // Check if email already exists
//        if (repository.existsByEmail(userDto.getEmail())) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already in use");
//        }
//
//        // Save User
//        User user = User.builder()
//                .name(userDto.getName())
//                .email(userDto.getEmail())
//                .password(passwordEncoder.encode(userDto.getPassword()))
//                .role(userDto.getRole())
//                .build();
//
//        repository.save(user);
//
//        // Role-based handling
//        if (user.getRole() == Role.RENTAL_COMPANY) {
//            if (rentalCompanyDto != null) {
//                rentalCompanyDto.setUserId(user.getId());
//                rentalCompanyDto.setCompanyId(user.getId());
//
//                try {
//                    rentalCompanyClient.registerRentalCompany(rentalCompanyDto);
//                } catch (Exception e) {
//                    System.err.println("Failed to register rental company: " + e.getMessage());
//                }
//            }else {
//                System.err.println("RentalCompanyDto is null for RENTAL_COMPANY role");
//            }
//        } else if (user.getRole() == Role.CUSTOMER) {
//            if (customerDto != null) {
//                customerDto.setUserId(user.getId());
//                customerDto.setCustomerId(user.getId());
//
//                try {
//                    customerClient.registercustomer(customerDto);
//                } catch (Exception e) {
//                    System.err.println("Failed to register customer: " + e.getMessage());
//                }
//            } else {
//                System.err.println("CustomerDto is null for CUSTOMER role");
//            }
//        }
//
//        return ResponseEntity.ok("User registered successfully");
//    }
public ResponseEntity<String> initiateUserRegistration(UserRegistrationRequest request) {
    UserDto userDto = request.getUser();

    // Check if email already exists
    if (repository.existsByEmail(userDto.getEmail())) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already in use");
    }

    // Validate required fields
    if (userDto.getEmail() == null || userDto.getEmail().trim().isEmpty()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is required");
    }

    try {
        // Send OTP
        ResponseEntity<String> otpResponse = notificationClient.sendOTP(userDto.getEmail());
        System.out.println(otpResponse);
        if (otpResponse.getStatusCode() == HttpStatus.OK) {
            // Store registration data temporarily
            temporaryStorage.storePendingRegistration(userDto.getEmail(), request);
            return ResponseEntity.ok("OTP sent to your email. Please verify to complete registration.");
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
    public User verifyOTPAndCompleteRegistration(OTPSendDTO otpRequest) {
        String email = otpRequest.getEmail();
        String otp = otpRequest.getOtp();

        if (!temporaryStorage.hasPendingRegistration(email)) {
            return null;
        }

        try {
            ResponseEntity<String> validationResponse = notificationClient.validateOTP(email, otp);

            if (validationResponse.getStatusCode() != HttpStatus.OK) {
                return null;
            }

            UserRegistrationRequest storedRequest = temporaryStorage.getPendingRegistration(email);
            if (storedRequest == null) {
                return null;
            }

            User user = completeUserRegistration(storedRequest);

            temporaryStorage.removePendingRegistration(email);
            return user;

        } catch (Exception e) {
            System.err.println("Failed to verify OTP: " + e.getMessage());
            return null;
        }
    }


    private User completeUserRegistration(UserRegistrationRequest request) {
        UserDto userDto = request.getUser();
        RentalCompanyDto rentalCompanyDto = request.getRentalCompany();
        CustomerDto customerDto = request.getCustomer();

        if (repository.existsByEmail(userDto.getEmail())) {
            throw new IllegalStateException("Email already in use");
        }

        User user = User.builder()
                .name(userDto.getName())
                .email(userDto.getEmail())
                .password(passwordEncoder.encode(userDto.getPassword()))
                .role(userDto.getRole())
                .build();

        repository.save(user);

        if (user.getRole() == Role.RENTAL_COMPANY && rentalCompanyDto != null) {
            rentalCompanyDto.setUserId(user.getId());
            rentalCompanyDto.setCompanyId(user.getId());
            rentalCompanyDto.setEmail(user.getEmail());
            try {
                rentalCompanyClient.registerRentalCompany(rentalCompanyDto);
            } catch (Exception e) {
                System.err.println("Failed to register rental company: " + e.getMessage());
            }
        } else if (user.getRole() == Role.CUSTOMER && customerDto != null) {
            customerDto.setUserId(user.getId());
            customerDto.setCustomerId(user.getId());
            customerDto.setEmail(user.getEmail());
            try {
                customerClient.registercustomer(customerDto);
            } catch (Exception e) {
                System.err.println("Failed to register customer: " + e.getMessage());
            }
        }

        return user;
    }




    public String generateToken(String email) {
        return jwtService.generateToken(email);
    }

    public void validateToken(String token) {
        jwtService.validateToken(token);
    }

    public UserDto getUserById(int userId) {
        Optional<User> optionalUser = repository.findById(userId);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            // Creating a DTO with custom data
            UserDto userDto = new UserDto();
            userDto.setName(user.getName());
            userDto.setEmail(user.getEmail());


            return userDto;
        }else{
            return null;
        }
    }

    public Integer getUserIdByEmail(String email) {
        return repository.findByEmail(email)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));
    }

}
