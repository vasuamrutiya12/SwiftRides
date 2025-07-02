package com.ReviewService.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer reviewId;

    private Integer carId;
    private Integer companyId;
    private Integer customerId;
    private Double rating;
    private String comment;

    private String reply;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "report_id", referencedColumnName = "reportId")
    private Report report;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", nullable = false, updatable = false)
    private Date createdAt;
}
