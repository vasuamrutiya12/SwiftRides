package com.notification.NotificationService.Repository;


import com.notification.NotificationService.Entity.OTP;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OTPRepository extends JpaRepository<OTP, Long> {
    Optional<OTP> findByEmailAndOtp(String email, String otp);
    void deleteByEmail(String email);
}

