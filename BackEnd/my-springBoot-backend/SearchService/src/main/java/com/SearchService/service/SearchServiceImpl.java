package com.SearchService.service;

import com.SearchService.client.InventoryClient;
import com.SearchService.dto.CarStatusUpdateRequest;
import com.SearchService.dto.SearchResponse;
import com.SearchService.dto.Car;
import com.SearchService.dto.RentalCompany;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchServiceImpl implements SearchService {

    private final ResilientService resilientService;
    @Autowired
    private InventoryClient inventoryClient;
    @Autowired
    public SearchServiceImpl(ResilientService resilientService) {
        this.resilientService = resilientService;
    }

    @Override
    public List<SearchResponse> search(String keyword, String city, String category, Double maxRate,
                                       LocalDateTime pickupDate, LocalDateTime returnDate)
    {
        List<Car> cars = resilientService.getAllCars();
        List<RentalCompany> companies = resilientService.getAllCompanies();

        return cars.stream()
                .filter(car -> keyword == null || car.getMake().toLowerCase().contains(keyword.toLowerCase()) || car.getModel().toLowerCase().contains(keyword.toLowerCase()))
                .filter(car -> category == null || car.getCategory().equalsIgnoreCase(category))
                .filter(car -> maxRate == null || car.getDailyRate() <= maxRate)
                .filter(car -> {
                    try {
                        // Build request with date range if needed, here dummy future range added
                        CarStatusUpdateRequest request = CarStatusUpdateRequest.builder()
                                .from(pickupDate)
                                .to(returnDate)
                                .build();
                        return inventoryClient.checkAvailability(car.getCarId(), request);
                    } catch (Exception e) {
                        // Fallback: if inventory check fails, exclude the car
                        return false;
                    }
                })
                .map(car -> {
                    RentalCompany company = companies.stream()
                            .filter(c -> c.getCompanyId().equals(car.getCompanyId()))
                            .findFirst()
                            .orElse(null);
                    return new SearchResponse(car, company);
                })
                .filter(sr -> city == null || (sr.getCompany() != null && sr.getCompany().getCity().equalsIgnoreCase(city)))
                .collect(Collectors.toList());
    }

}
