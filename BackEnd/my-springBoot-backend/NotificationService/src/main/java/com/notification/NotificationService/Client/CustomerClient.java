package com.notification.NotificationService.Client;

import com.notification.NotificationService.Config.FeignClientConfig;
import com.notification.NotificationService.dto.CustomerDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "customer-service", configuration = FeignClientConfig.class)
public interface CustomerClient {
    @GetMapping("/api/customers/{id}")
    CustomerDTO getCustomer(@PathVariable("id") int id);
}
