package com.notification.NotificationService.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {


    public Notification(String recipient, String subject, String body, LocalDateTime timestamp) {
        this.recipient = recipient;
        this.subject = subject;
        this.body = body;
        this.timestamp = timestamp;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String recipient;

    private String subject;

    @Column(columnDefinition = "TEXT")
    private String body;

    private LocalDateTime timestamp;
}
