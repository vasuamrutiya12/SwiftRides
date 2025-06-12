package com.carrental.BookingService.Service;

import com.carrental.BookingService.DTO.BookingDetailsResponse;
import com.carrental.BookingService.DTO.Car;
import com.carrental.BookingService.DTO.CarStatusUpdateRequest;
import com.carrental.BookingService.DTO.RentalCompany;
import com.carrental.BookingService.Entity.Booking;
import com.carrental.BookingService.Feign.InventoryClient;
import com.carrental.BookingService.Feign.RentalCompanyClient;
import com.carrental.BookingService.Feign.CarClient;
import com.carrental.BookingService.Repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private  BookingRepository bookingRepository;
    @Autowired
    private ResilientService resilientService;
    @Autowired
    private InventoryClient inventoryClient;
    private Car car;


    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public Optional<Booking> getBookingById(int id) {
        return bookingRepository.findById(id);
    }

    @Override
    public Booking addBooking(Booking booking) {

        CarStatusUpdateRequest statusRequest = CarStatusUpdateRequest.builder()
                .status("booked")
                .from(booking.getPickupDate())
                .to(booking.getReturnDate())
                .build();

        boolean isAvailable = inventoryClient.checkCarAvailability(
                booking.getCarId(), statusRequest);

        if (!isAvailable) {
            throw new RuntimeException("Car is not available for the selected dates.");
        }

        inventoryClient.updateCarStatus(booking.getCarId(), statusRequest);

        return bookingRepository.save(booking);
    }

    @Override
    public Booking updateBooking(int id, Booking bookingDetails) {
        return bookingRepository.findById(id).map(booking -> {
            if (bookingDetails.getCompanyID() != 0) booking.setCompanyID(bookingDetails.getCompanyID());
            if (bookingDetails.getCustomerId() != 0) booking.setCustomerId(bookingDetails.getCustomerId());
            if (bookingDetails.getCarId() != 0) booking.setCarId(bookingDetails.getCarId());
            if (bookingDetails.getPickupDate() != null) booking.setPickupDate(bookingDetails.getPickupDate());
            if (bookingDetails.getReturnDate() != null) booking.setReturnDate(bookingDetails.getReturnDate());
            if (bookingDetails.getTotalDays() != 0) booking.setTotalDays(bookingDetails.getTotalDays());
            if (bookingDetails.getTotalAmount() != 0) booking.setTotalAmount(bookingDetails.getTotalAmount());
            if (bookingDetails.getStatus() != null && !bookingDetails.getStatus().isEmpty())
                booking.setStatus(bookingDetails.getStatus());
            if (bookingDetails.getBookingReference() != null && !bookingDetails.getBookingReference().isEmpty())
                booking.setBookingReference(bookingDetails.getBookingReference());

            return bookingRepository.save(booking);
        }).orElseThrow(() -> new RuntimeException("Booking not found with id " + id));
    }

    @Override
    public void deleteBooking(int id) {
        bookingRepository.deleteById(id);
    }

    @Override
    public List<Booking> getBookingByCustomerId(int customerId) {
        return bookingRepository.findByCustomerId(customerId);
    }

    @Override
    public BookingDetailsResponse getBookingDetails(int bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Car car = resilientService.getCarById(booking.getCarId());
        RentalCompany company = (car != null) ? resilientService.getCompanyById(car.getCompanyId()) : null;

        BookingDetailsResponse response = new BookingDetailsResponse();
        response.setBooking(booking);
        response.setCar(car);
        response.setRentalCompany(company);

        return response;
    }

    @Override
    public Integer getBookingCustomersByCompanyId(int companyId) {
        List<Booking> allBookings = bookingRepository.findAll(); // Or a custom query to fetch only relevant bookings

        Set<Integer> uniqueCustomerIds = new HashSet<>();

        for (Booking booking : allBookings) {
            Car car = resilientService.getCarById(booking.getCarId());
            if (car != null && car.getCompanyId() == companyId) {
                uniqueCustomerIds.add(booking.getCustomerId());
            }
        }

        return uniqueCustomerIds.size();
    }

    @Override
    public List<Booking> getBookingByCompanyId(int companyId) {
        return bookingRepository.findByCompanyID(companyId);
    }

    @Override
    public Long getTotalBookings() {
        return bookingRepository.count();
    }

    @Override
    public Double getTotalRevenue() {
        List<Booking> bookings = bookingRepository.findAll();
        return bookings.stream()
                .mapToDouble(booking -> booking.getTotalAmount())
                .sum();
    }

}
