package com.PaymentService.DTOs;

import lombok.Data;

import java.util.UUID;

@Data
public class PaymentResponse {
    private String status;
    private String message;
    private String checkoutUrl;
    private String sessionId;
    private int paymentId;
    private String clientSecret; // For payment intents
}
