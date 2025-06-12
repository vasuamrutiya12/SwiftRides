package com.CustomerService.service;
import com.CustomerService.Repo.CustomerRepo;
import com.CustomerService.client.BookingServiceClient;
import com.CustomerService.client.CarClient;
import com.CustomerService.client.ReviewClient;
import com.CustomerService.dto.BookingRequestDto;
import com.CustomerService.dto.CarDto;
import com.CustomerService.dto.ReviewDto;
import com.CustomerService.model.Customer;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepo customerRepository;
    @Autowired
    private BookingServiceClient bookingServiceClient;
    @Autowired
    private ReviewClient reviewClient;
    @Autowired
    private CarClient carClient;

    @Override
    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    @Override
    public Optional<Customer> getCustomerById(Integer id) {
        return customerRepository.findById(id);
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public Customer updateCustomer(Integer id, Customer updatedCustomer) {
        return customerRepository.findById(id)
                .map(existing -> {
                    existing.setFullName(updatedCustomer.getFullName());
                    existing.setPhoneNumber(updatedCustomer.getPhoneNumber());
                    existing.setAddress(updatedCustomer.getAddress());
                    existing.setDrivingLicenseNumber(updatedCustomer.getDrivingLicenseNumber());
                    return customerRepository.save(existing);
                }).orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    @Override
    public void deleteCustomer(Integer id) {
        customerRepository.deleteById(id);
    }



    public ResponseEntity<BookingRequestDto> makeBooking(Integer customerId,BookingRequestDto request) {
        request.setCustomerId(customerId);
        ResponseEntity<BookingRequestDto> response = bookingServiceClient.createBooking(request);
        return response; // could be booking reference or message
    }

    @Override
    public ResponseEntity<List<BookingRequestDto>> getCustomerWithBooking(Integer customerId) {
        ResponseEntity<List<BookingRequestDto>> bookingsResponse = bookingServiceClient.getBookingByCustomerId(customerId);
        List<BookingRequestDto> bookings = bookingsResponse.getBody();

        if (bookings == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        for (BookingRequestDto booking : bookings) {
            CarDto car = carClient.getCarById(booking.getCarId()); // Assumes carClient returns CarDto
            booking.setCar(car);
        }

        return ResponseEntity.ok(bookings);
    }

    @Override
    public ResponseEntity<List<ReviewDto>> getCustomerWithReviews(Integer customerId) {
        ResponseEntity<List<ReviewDto>> reviewsResponse = reviewClient.getCustomerReviews(customerId);
        List<ReviewDto> reviews = reviewsResponse.getBody();

        if (reviews == null || reviews.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        // Attach car details to each review
        for (ReviewDto review : reviews) {
            try {
                CarDto carDto = carClient.getCarById(review.getCarId());
                review.setCarDto(carDto);  // Make sure ReviewDto has `CarDto car` field
            } catch (Exception e) {
                // Log or handle if car service fails
                System.err.println("Failed to fetch car for review ID: " + review.getReviewId());
            }
        }

        return ResponseEntity.ok(reviews);
    }




    @Override
    public CarDto addReviewofCar(int customerId, int carId, ReviewDto reviewDto) {
        reviewClient.createReview(carId,customerId,reviewDto);
        CarDto carDto = carClient.getCarById(carId);

        return carDto;
    }

    @Override
    public Long getTotalCustomers() {
        return customerRepository.count();
    }

}

