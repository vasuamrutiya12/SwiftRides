package com.carrental.BookingService.DTO;

import com.carrental.BookingService.Entity.Booking;
import lombok.Data;

@Data
public class BookingDetailsResponse {
    private Booking booking;
    private Car car;
    private RentalCompany rentalCompany;
}
