package com.CustomerService.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service")
public interface UserClient {

    @DeleteMapping("/auth/user/{userId}")
    void deleteUserById(@PathVariable("userId") int id);

}
