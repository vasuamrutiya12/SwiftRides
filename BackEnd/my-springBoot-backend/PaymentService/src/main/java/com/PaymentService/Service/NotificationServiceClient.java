package com.PaymentService.Service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "notification-service")
public interface NotificationServiceClient {

    @GetMapping("/api/notification/booking-confirmation/{bookingId}")
    ResponseEntity<String> sendBookingConfirmation(@PathVariable("bookingId") int bookingId);
}
