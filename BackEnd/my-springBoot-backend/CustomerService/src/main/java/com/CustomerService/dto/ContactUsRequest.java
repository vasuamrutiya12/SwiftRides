package com.CustomerService.dto;

import lombok.Data;

@Data
public class ContactUsRequest {
    private String name;
    private String email;
    private String subject;
    private String category;
    private String message;
} 