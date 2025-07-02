package com.PaymentService.Repository;

import com.PaymentService.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Optional<Payment> findByBookingId(int bookingId);
    Optional<Payment> findByStripeSessionId(String sessionId);
    Optional<Payment> findByStripePaymentIntentId(String paymentIntentId);
    List<Payment> findByCompanyId(int companyId);
}