package com.CustomerService.dto;

import lombok.Data;

@Data
public class ReviewDto {
    private Integer reviewId;
    private Integer customerId;
    private Integer carId;
    private Double rating;
    private String comment;
    private CarDto carDto;
}