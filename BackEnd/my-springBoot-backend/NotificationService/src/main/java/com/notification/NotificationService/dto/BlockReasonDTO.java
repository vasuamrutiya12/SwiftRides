package com.notification.NotificationService.dto;

import lombok.Data;

@Data
public class BlockReasonDTO {
    private int customerId;
    private String customerEmail;
    private String customerName;
    private String reason;
} 