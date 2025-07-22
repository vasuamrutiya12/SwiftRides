package com.CustomerService.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.security.Timestamp;
import java.time.LocalDate;

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

    @Column(name = "dateOfBirth")
    private LocalDate dateOfBirth ;  // Date of Birth

    @Column(columnDefinition = "TEXT")
    private String address;

    private String drivingLicenseNumber;

    private String drivingLicenseImg;

    private String drivingLicenseStatus;


}
