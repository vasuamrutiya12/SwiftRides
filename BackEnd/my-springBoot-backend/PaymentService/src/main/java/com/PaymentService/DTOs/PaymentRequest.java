package com.PaymentService.DTOs;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class PaymentRequest {
    private int bookingId;
    private int companyId;
    private BigDecimal amount;
    private String paymentMethod = "card"; // Default to card
    private String currency = "usd"; // Default currency
    private String customerEmail;
    private String description;
}
