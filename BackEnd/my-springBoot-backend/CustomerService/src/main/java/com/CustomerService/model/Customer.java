package com.CustomerService.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.security.Timestamp;

@Entity
@Table(name = "customers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    private Integer customerId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    private String email;

    private String fullName;

    private String phoneNumber;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String drivingLicenseNumber;

}
