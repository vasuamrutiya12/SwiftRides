package com.PaymentService.DTOs;

import lombok.Data;

@Data
public class WebhookEvent {
    private String id;
    private String type;
    private Object data;
    private String livemode;
}
