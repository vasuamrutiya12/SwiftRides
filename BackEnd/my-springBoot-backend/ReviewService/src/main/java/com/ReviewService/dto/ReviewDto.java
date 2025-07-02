package com.ReviewService.dto;

import com.ReviewService.model.Report;
import lombok.Data;

import java.util.Date;

@Data
public class ReviewDto {
    private Integer reviewId;
    private Integer carId;
    private Integer companyId;
    private Integer customerId;
    private Double rating;
    private String comment;
    private Date createdAt;
    private String reply;
    private Report report;


}
