package com.CustomerService.controller;

import com.CustomerService.dto.BookingRequestDto;
import com.CustomerService.dto.CarDto;
import com.CustomerService.dto.ReviewDto;
import com.CustomerService.model.Customer;
import com.CustomerService.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        return ResponseEntity.ok(customerService.createCustomer(customer));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Integer id) {
        return customerService.getCustomerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Integer id, @RequestBody Customer customer) {
        return ResponseEntity.ok(customerService.updateCustomer(id, customer));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Integer id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{customerId}/booking")
    public ResponseEntity<BookingRequestDto> bookCar(@PathVariable("customerId") Integer customerId,@RequestBody BookingRequestDto bookingRequest) {
        ResponseEntity<BookingRequestDto> booking = customerService.makeBooking(customerId,bookingRequest);
        return booking;
    }

    @GetMapping("/{customerId}/booking")
    public ResponseEntity<List<BookingRequestDto>> getCustomerWithBookings(@PathVariable("customerId") Integer customerId) {
        ResponseEntity<List<BookingRequestDto>> bookings = customerService.getCustomerWithBooking(customerId);
        return bookings;
    }


    @PostMapping("/{customerId}/car/{carId}/review")
    public ResponseEntity<CarDto> addReviewofCar(@PathVariable("customerId") Integer customerId, @PathVariable("carId") Integer carId, @RequestBody ReviewDto reviewDto){
        CarDto car =customerService.addReviewofCar(customerId,carId,reviewDto);
        return ResponseEntity.ok(car);
    }

    @GetMapping("/{customerId}/reviews")
    public ResponseEntity<List<ReviewDto>> getCustomerWithReviews(@PathVariable Integer customerId) {
        return customerService.getCustomerWithReviews(customerId);
    }

    @GetMapping("/total")
    public ResponseEntity<Long> getTotalCustomers() {
        Long total = customerService.getTotalCustomers();
        return ResponseEntity.ok(total);
    }

}

