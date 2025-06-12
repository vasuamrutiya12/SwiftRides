package com.PaymentService.Service;

import com.PaymentService.DTOs.BookingDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;
import java.util.UUID;

@FeignClient(name = "booking-service")
public interface BookingClient {
    @GetMapping("/api/bookings/{id}")
    BookingDTO getBookingById(@PathVariable("id") int bookingId);

    @PutMapping("/api/bookings/{id}")
    void updateBookingStatus(@PathVariable("id") int bookingId, @RequestBody Map<String, String> requestBody);
}
