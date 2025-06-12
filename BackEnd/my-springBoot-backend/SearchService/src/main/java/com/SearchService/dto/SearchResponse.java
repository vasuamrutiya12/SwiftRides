package com.SearchService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SearchResponse {
    private Car car;
    private RentalCompany company;
}

