package com.RentalCompaniesService.model;

import com.RentalCompaniesService.Dto.CarDto;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "RentalCompanies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RentalCompany {

    @Id
    private Integer companyId;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    private String email;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false, precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(nullable = false, precision = 11, scale = 8)
    private BigDecimal longitude;

    private String phoneNumber;

    @Column(length = 50)
    private String status = "active"; // default 'active'

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "user_id")
    private String userId; // Linked user

    transient private List<CarDto> cars;

    @Column(name = "rating")
    private Long rating;
}
