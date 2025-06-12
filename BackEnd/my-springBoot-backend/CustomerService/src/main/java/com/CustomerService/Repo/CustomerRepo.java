package com.CustomerService.Repo;

import com.CustomerService.dto.BookingRequestDto;
import com.CustomerService.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepo extends JpaRepository<Customer, Integer> {
    List<BookingRequestDto> findBookingsByCustomerId(Integer companyId);
    Customer findByEmail(String email);
}

