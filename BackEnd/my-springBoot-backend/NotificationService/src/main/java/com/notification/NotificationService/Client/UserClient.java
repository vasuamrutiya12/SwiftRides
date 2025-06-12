package com.notification.NotificationService.Client;

import com.notification.NotificationService.Config.FeignClientConfig;
import com.notification.NotificationService.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service", configuration = FeignClientConfig.class)
public interface UserClient {
    @GetMapping("/auth/user/{id}")
    UserDTO getUser(@PathVariable("id") int id);
}
