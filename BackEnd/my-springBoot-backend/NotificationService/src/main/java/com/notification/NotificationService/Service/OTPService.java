package com.notification.NotificationService.Service;


import com.notification.NotificationService.Entity.Notification;
import com.notification.NotificationService.Entity.OTP;
import com.notification.NotificationService.Repository.OTPRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OTPService {
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private OTPRepository otpRepository;

    public void sendOTP(String email) {
        String otp = generateOTP();
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(5);

        OTP otpEntity = new OTP();
        otpEntity.setEmail(email);
        otpEntity.setOtp(otp);
        otpEntity.setExpirationTime(expirationTime);

        otpRepository.save(otpEntity);
        System.out.println(otpEntity);
        String subject = "Your OTP for Email Verification";
        String body = String.format(
                "<html>" +
                        "<body>" +
                        "<h2>Your OTP is: %s</h2>" +
                        "<p>Please use this OTP to verify your email. It will expire in 5 minutes.</p>" +
                        "</body>" +
                        "</html>", otp);

        sendEmail(email, subject, body);
    }
    @Transactional
    public boolean validateOTP(String email, String otp) {
        Optional<OTP> otpEntity = otpRepository.findByEmailAndOtp(email, otp);

        if (otpEntity.isPresent() && otpEntity.get().getExpirationTime().isAfter(LocalDateTime.now())) {
            otpRepository.deleteByEmail(email);
            return true;
        }

        return false;
    }

    private String generateOTP() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }

    private void sendEmail(String email, String subject, String body) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(body, true); // Enable HTML content

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new IllegalStateException("Failed to send email", e);
        }
    }

}
