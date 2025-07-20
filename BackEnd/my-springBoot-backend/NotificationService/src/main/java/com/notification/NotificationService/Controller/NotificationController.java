package com.notification.NotificationService.Controller;

import com.notification.NotificationService.Service.NotificationService;
import com.notification.NotificationService.Service.OTPService;
import com.notification.NotificationService.dto.BlockReasonDTO;
import com.notification.NotificationService.dto.QueryDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private OTPService otpService;

    @GetMapping("/booking-confirmation/{bookingId}")
    public ResponseEntity<String> sendBookingConfirmation(@PathVariable int bookingId) {
        try {
            notificationService.sendBookingConfirmation(bookingId);
            return ResponseEntity.ok("Booking confirmation emails sent.");
        } catch (Exception e) {
            // log full stack trace
            e.printStackTrace(); // or use log.error(...)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error sending booking confirmation: " + e.getMessage());
        }
    }

    @PostMapping("/send/answer")
    public ResponseEntity<String> sendQueryAnswer(@RequestBody QueryDTO queryDTO) {
        notificationService.sendQueryAnswer(queryDTO);
        return ResponseEntity.ok("Query Responded send successfully");
    }

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOTP(@RequestParam String email) {
        otpService.sendOTP(email);
        return ResponseEntity.ok("OTP sent to email");
    }

    @PostMapping("/validate-otp")
    public ResponseEntity<String> validateOTP(@RequestParam String email, @RequestParam String otp) {
        boolean isValid = otpService.validateOTP(email, otp);
        if (isValid) {
            return ResponseEntity.ok("OTP validated successfully");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired OTP");
    }

    @PostMapping("/block-reason")
    public ResponseEntity<String> sendBlockReasonToCustomer(@RequestBody BlockReasonDTO blockReasonDTO) {
        try {
            notificationService.sendBlockReasonToCustomer(blockReasonDTO);
            return ResponseEntity.ok("Block reason sent to customer successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error sending block reason: " + e.getMessage());
        }
    }
}
