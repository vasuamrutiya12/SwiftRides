package com.SearchService.service;

import com.SearchService.client.InventoryClient;
import com.SearchService.dto.CarStatusUpdateRequest;
import com.SearchService.dto.SearchResponse;
import com.SearchService.dto.Car;
import com.SearchService.dto.RentalCompany;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import org.apache.commons.text.similarity.JaroWinklerSimilarity;


@Service
public class SearchServiceImpl implements SearchService {

    private final ResilientService resilientService;
    private final InventoryClient inventoryClient;

    @Autowired
    public SearchServiceImpl(ResilientService resilientService, InventoryClient inventoryClient) {
        this.resilientService = resilientService;
        this.inventoryClient = inventoryClient;
    }

    @Override
    public List<SearchResponse> search(String keyword, String city, String category, Double maxRate,
                                       LocalDateTime pickupDate, LocalDateTime returnDate) {

        List<Car> allCars = resilientService.getAllCars();
        List<RentalCompany> allCompanies = resilientService.getAllCompanies();

        // Pre-index rental companies by ID for fast lookup
        Map<Integer, RentalCompany> companyMap = allCompanies.stream()
                .collect(Collectors.toMap(RentalCompany::getCompanyId, c -> c));

        // Basic filters before remote call
        Predicate<Car> baseFilter = car ->
                (car.getStatus() == null || !"reject".equalsIgnoreCase(car.getStatus())) &&
                        (keyword == null || containsIgnoreCase(car.getMake(), keyword) || containsIgnoreCase(car.getModel(), keyword)) &&
                        (category == null || category.equalsIgnoreCase(car.getCategory())) &&
                        (maxRate == null || car.getDailyRate() <= maxRate);

        List<Car> filteredCars = allCars.stream()
                .filter(baseFilter)
                .collect(Collectors.toList());

        // Build once
        CarStatusUpdateRequest availabilityRequest = CarStatusUpdateRequest.builder()
                .from(pickupDate)
                .to(returnDate)
                .build();

        return filteredCars.stream()
                .filter(car -> isAvailable(car.getCarId(), availabilityRequest))
                .map(car -> {
                    RentalCompany company = companyMap.get(car.getCompanyId());
                    return new SearchResponse(car, company);
                })
                .filter(sr -> city == null || (sr.getCompany() != null && isCityMatch(sr.getCompany().getCity(), city)))
                .collect(Collectors.toList());

    }

    private boolean isAvailable(Integer carId, CarStatusUpdateRequest request) {
        try {
            return inventoryClient.checkAvailability(carId, request);
        } catch (Exception e) {
            return false;
        }
    }

    private boolean containsIgnoreCase(String source, String keyword) {
        return source != null && keyword != null && source.toLowerCase().contains(keyword.toLowerCase());
    }


    private boolean isCityMatch(String actualCity, String userInputCity) {
        if (actualCity == null || userInputCity == null) return false;

        JaroWinklerSimilarity similarity = new JaroWinklerSimilarity();
        double score = similarity.apply(actualCity.toLowerCase(), userInputCity.toLowerCase());

        return score >= 0.85; // Tunable threshold: 0.85 means 85% similar
    }


}
