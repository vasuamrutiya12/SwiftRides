package com.CustomerService.client;

import com.CustomerService.dto.CarDto;
import com.CustomerService.model.ContactUs;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;


@FeignClient(name = "notification-service")
public interface NotificationServiceClient {
    @PostMapping("/api/notification/send/answer")
    ResponseEntity<String> sendQueryAnswer(ContactUs contactUs);
}
