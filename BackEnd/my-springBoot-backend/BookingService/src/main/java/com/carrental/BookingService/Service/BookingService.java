package com.carrental.BookingService.Service;

import com.carrental.BookingService.DTO.BookingDetailsResponse;
import com.carrental.BookingService.Entity.Booking;

import java.util.List;
import java.util.Optional;

public interface BookingService {

    List<Booking> getAllBookings();

    Optional<Booking> getBookingById(int id);

    Booking addBooking(Booking booking);

    Booking updateBooking(int id, Booking bookingDetails);

    void deleteBooking(int id);

    List<Booking> getBookingByCustomerId(int customerId);

    BookingDetailsResponse getBookingDetails(int id);

    Integer getBookingCustomersByCompanyId(int companyId);

    List<Booking> getBookingByCompanyId(int companyId);

    Long getTotalBookings();

    Double getTotalRevenue();
}