package com.carrental.BookingService.Controller;


import com.carrental.BookingService.DTO.BookingDetailsResponse;
import com.carrental.BookingService.Entity.Booking;
import com.carrental.BookingService.Service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable int id) {
        Optional<Booking> booking = bookingService.getBookingById(id);
        return booking.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Booking>> getBookingByCustomerId(@PathVariable int customerId) {
        List<Booking> bookings = bookingService.getBookingByCustomerId(customerId);
        return ResponseEntity.ok(bookings);
    }

    @PostMapping
    public ResponseEntity<Booking> addBooking(@RequestBody Booking booking) {
        Booking savedBooking = bookingService.addBooking(booking);
        return ResponseEntity.ok(savedBooking);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable int id, @RequestBody Booking bookingDetails) {
        try {
            Booking updatedBooking = bookingService.updateBooking(id, bookingDetails);
            return ResponseEntity.ok(updatedBooking);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable int id) {
        try {
            bookingService.deleteBooking(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/details/{id}")
    public ResponseEntity<BookingDetailsResponse> getBookingDetails(@PathVariable int id) {
        BookingDetailsResponse details = bookingService.getBookingDetails(id);
        return ResponseEntity.ok(details);
    }

    @GetMapping("/companyId/{companyId}/bookingCustomers")
    public Integer getBookingCustomersByCompanyId(@PathVariable("companyId") int companyId){
        Integer bookingCustomers = bookingService.getBookingCustomersByCompanyId(companyId);
        return bookingCustomers;
    }

    @GetMapping("/companyId/{companyId}")
    public ResponseEntity<List<Booking>> getBookingByCompanyId(@PathVariable int companyId) {
        List<Booking> bookings = bookingService.getBookingByCompanyId(companyId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/total")
    public ResponseEntity<Long> getTotalBookings() {
        Long total = bookingService.getTotalBookings();
        return ResponseEntity.ok(total);
    }

    @GetMapping("/total-revenue")
    public ResponseEntity<Double> getTotalRevenue() {
        Double totalRevenue = bookingService.getTotalRevenue();
        return ResponseEntity.ok(totalRevenue);
    }


}

