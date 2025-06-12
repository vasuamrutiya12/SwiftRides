package com.CustomerService.service;

import com.CustomerService.dto.BookingRequestDto;
import com.CustomerService.dto.CarDto;
import com.CustomerService.dto.ReviewDto;
import com.CustomerService.model.Customer;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

public interface CustomerService {

    Customer createCustomer(Customer customer);

    Optional<Customer> getCustomerById(Integer id);

    List<Customer> getAllCustomers();

    Customer updateCustomer(Integer id, Customer updatedCustomer);

    void deleteCustomer(Integer id);

    ResponseEntity<BookingRequestDto> makeBooking(Integer customerId,BookingRequestDto request);

    ResponseEntity<List<BookingRequestDto>> getCustomerWithBooking(Integer customerId);

    ResponseEntity<List<ReviewDto>> getCustomerWithReviews(Integer customerId);

    CarDto addReviewofCar(int customerId, int carId, ReviewDto reviewDto);

    Long getTotalCustomers();


}

