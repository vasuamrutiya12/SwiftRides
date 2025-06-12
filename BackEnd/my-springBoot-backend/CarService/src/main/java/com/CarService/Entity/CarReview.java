package com.CarService.Entity;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import lombok.Data;

import java.util.List;

@Embeddable
@Data
public class CarReview {

    @ElementCollection
    private List<Long> reviewIds;
    
    @ElementCollection
    private List<Double> rating;

    @ElementCollection
    private List<String> comments;


}
