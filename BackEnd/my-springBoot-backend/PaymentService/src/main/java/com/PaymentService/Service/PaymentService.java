package com.PaymentService.Service;

import com.PaymentService.DTOs.PaymentRequest;
import com.PaymentService.DTOs.PaymentResponse;
import com.PaymentService.Entity.Payment;
import com.stripe.exception.StripeException;

public interface PaymentService {
    PaymentResponse createPaymentSession(PaymentRequest request);
    PaymentResponse getPaymentStatus(int paymentId);
    Payment getPaymentByBookingId(int bookingId);
    PaymentResponse verifyPayment(String sessionId) throws StripeException;
    void handleWebhookEvent(String payload, String sigHeader);
    Long getTotalPayments();
    Double getTotalAmount();
}