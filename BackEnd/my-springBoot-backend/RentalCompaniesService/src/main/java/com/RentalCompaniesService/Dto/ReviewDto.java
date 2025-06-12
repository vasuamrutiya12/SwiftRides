package com.RentalCompaniesService.Dto;
import lombok.Data;

import java.util.Date;

@Data
public class ReviewDto {
    private Integer reviewId;
    private Integer carId;
    private Integer customerId;
    private Double rating;
    private String comment;
    private Date createdAt;

}
