package com.UserService.service;

import com.UserService.dto.UserRegistrationRequest;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TemporaryRegistrationStorage {

    private final Map<String, UserRegistrationRequest> pendingRegistrations = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> registrationTimestamps = new ConcurrentHashMap<>();
    private static final int EXPIRATION_MINUTES = 10; // OTP expires in 10 minutes

    public void storePendingRegistration(String email, UserRegistrationRequest request) {
        pendingRegistrations.put(email, request);
        registrationTimestamps.put(email, LocalDateTime.now());
    }

    public UserRegistrationRequest getPendingRegistration(String email) {
        cleanExpiredRegistrations();
        return pendingRegistrations.get(email);
    }

    public void removePendingRegistration(String email) {
        pendingRegistrations.remove(email);
        registrationTimestamps.remove(email);
    }

    private void cleanExpiredRegistrations() {
        LocalDateTime now = LocalDateTime.now();
        registrationTimestamps.entrySet().removeIf(entry -> {
            if (entry.getValue().plusMinutes(EXPIRATION_MINUTES).isBefore(now)) {
                pendingRegistrations.remove(entry.getKey());
                return true;
            }
            return false;
        });
    }

    public boolean hasPendingRegistration(String email) {
        cleanExpiredRegistrations();
        return pendingRegistrations.containsKey(email);
    }
}

