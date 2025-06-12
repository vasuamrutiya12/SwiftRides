package com.notification.NotificationService.Service;

import com.notification.NotificationService.Client.BookingClient;
import com.notification.NotificationService.Client.UserClient;
import com.notification.NotificationService.dto.BookingDTO;
import com.notification.NotificationService.dto.UserDTO;
import com.notification.NotificationService.Entity.Notification;
import com.notification.NotificationService.Repository.NotificationRepo;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
public class NotificationService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private BookingClient bookingClient;

    @Autowired
    private UserClient userClient;

    @Autowired
    private NotificationRepo emailLogRepository;



    public void sendBookingConfirmation(int bookingId) {
        BookingDTO booking = bookingClient.getBooking(bookingId);
//        UserDTO manager = userClient.getUser(booking.getCompanyId());
//        log.info(manager.getEmail());
//        manager.setUserId(booking.getCompanyId());
        UserDTO customer = userClient.getUser(booking.getCustomerId());
        log.info(customer.getEmail());
        customer.setUserId(booking.getCustomerId());
        String subject = "Booking Confirmation";
        String body = String.format(
                """
                <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                        <h2 style="color: #007BFF;">Car Booking Confirmation</h2>
                        <p>Dear <strong>%s</strong>,</p>
                        <p>Thank you for choosing our car rental service. Your booking details are as follows:</p>
                        <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
                            <tr>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Car ID</th>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Pickup Date</th>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Return Date</th>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Total Amount</th>
                            </tr>
                            <tr>
                                <td style="border: 1px solid #ddd; padding: 8px;">%s</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">%s</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">%s</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">$%.2f</td>
                            </tr>
                        </table>
                        <p>If you have any questions, feel free to contact us. We're here to help!</p>
                        <p>Best regards,</p>
                        <p><strong>Car Rental Team</strong></p>
                    </body>
                </html>
              """,
                customer.getName(),
                booking.getCarId(),
                booking.getPickupDate(),
                booking.getReturnDate(),
                booking.getTotalAmount()
        );
        sendEmail(customer.getEmail(), subject, body);
        sendEmail("monkeyluffy.8511@gmail.com", subject, body);
    }


    private void sendEmail(String recipient, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(recipient);
            helper.setSubject(subject);
            helper.setText(body, true); // `true` enables HTML content

            mailSender.send(message);

            // Log email in database
            Notification nf = new Notification(recipient, subject, body, LocalDateTime.now());
            emailLogRepository.save(nf);
        } catch (Exception e) {
            e.printStackTrace(); // Handle exception appropriately in production
        }
    }

}
