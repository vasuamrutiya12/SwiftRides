package com.notification.NotificationService.dto;

import lombok.Data;

@Data
public class CustomerDTO {
    private int customerID;
    private String fullName;
    private String email;
    private  String phoneNumber;
}
