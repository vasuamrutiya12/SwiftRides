package com.UserService.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "notification-service")
public interface NotificationClient {

    @PostMapping("/api/notification/send-otp")
    ResponseEntity<String> sendOTP(@RequestParam String email);

    @PostMapping("/api/notification/validate-otp")
    ResponseEntity<String> validateOTP(@RequestParam String email, @RequestParam String otp);

}
