package com.notification.NotificationService.Client;

import com.notification.NotificationService.Config.FeignClientConfig;
import com.notification.NotificationService.dto.CustomerDTO;
import com.notification.NotificationService.dto.RentalCompanyDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@FeignClient(name = "rental-company-service", configuration = FeignClientConfig.class)
public interface RentalCompClient {
    @GetMapping("/api/rental-company/{id}")
    RentalCompanyDTO getRentalCompanyById(@PathVariable("id") int id);
}
