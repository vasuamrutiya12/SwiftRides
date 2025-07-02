package com.CustomerService.client;


import com.CustomerService.dto.BookingRequestDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.List;

@FeignClient(name = "booking-service")
public interface BookingServiceClient {

    @PostMapping("/api/bookings")
    ResponseEntity<BookingRequestDto> createBooking(BookingRequestDto bookingRequest);

    @GetMapping("/api/bookings/customer/{customerId}")
    ResponseEntity<List<BookingRequestDto>> getBookingByCustomerId(@PathVariable int customerId);

    }
