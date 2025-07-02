package com.notification.NotificationService.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class QueryDTO {
    private Long id;
    private String name;

    private String email;

    private String subject;

    private String category;

    private String message;

    private LocalDateTime createdAt;
    private LocalDateTime respondedAt;

    private String status;

    private String answer;
}
