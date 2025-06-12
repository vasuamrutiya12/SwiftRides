package com.SearchService.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarStatusUpdateRequest {
    private String status; // "available", "booked", "maintenance"
    private LocalDateTime from;
    private LocalDateTime to;
}