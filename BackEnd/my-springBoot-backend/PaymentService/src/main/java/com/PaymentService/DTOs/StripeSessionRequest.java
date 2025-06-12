package com.PaymentService.DTOs;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class StripeSessionRequest {
    private BigDecimal amount;
    private String currency;
    private String customerEmail;
    private String description;
    private String successUrl;
    private String cancelUrl;
    private String bookingReference;
}