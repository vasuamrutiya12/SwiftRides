package com.notification.NotificationService.Service;

import com.notification.NotificationService.Client.BookingClient;
import com.notification.NotificationService.Client.CustomerClient;
import com.notification.NotificationService.Client.RentalCompClient;
import com.notification.NotificationService.dto.BookingDTO;
import com.notification.NotificationService.dto.CustomerDTO;
import com.notification.NotificationService.dto.QueryDTO;
import com.notification.NotificationService.dto.RentalCompanyDTO;
import com.notification.NotificationService.dto.BlockReasonDTO;
import com.notification.NotificationService.Entity.Notification;
import com.notification.NotificationService.Repository.NotificationRepo;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

// Twilio imports
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

import java.time.LocalDateTime;

@Slf4j
@Service
public class NotificationService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private BookingClient bookingClient;

    @Autowired
    private CustomerClient customerClient;

    @Autowired
    private RentalCompClient rentalCompClient;

    @Autowired
    private NotificationRepo emailLogRepository;

    @Value("${twilio.whatsapp.from}")
    private String twilioWhatsAppFrom;

    @Value("${twilio.account.sid:}")
    private String twilioAccountSid;

    @Value("${twilio.auth.token:}")
    private String twilioAuthToken;



    public void sendBookingConfirmation(int bookingId) {
        BookingDTO booking = bookingClient.getBooking(bookingId);
        RentalCompanyDTO manager = rentalCompClient.getRentalCompanyById(booking.getCompanyID());
        manager.setCompanyId(booking.getCompanyID());
        CustomerDTO customer = customerClient.getCustomer(booking.getCustomerId());
        System.out.println(customer);
        System.out.println(customer.getFullName());
        customer.setCustomerID(booking.getCustomerId());
        String subject = "Booking Confirmation";
        String body = String.format(
                """
                <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.5; color: ##333;">
                        <h2 style="color: ##007BFF;">Car Booking Confirmation</h2>
                        <p>Dear <strong>%s</strong>,</p>
                        <p>Thank you for choosing our car rental service. Your booking details are as follows:</p>
                        <table style="border-collapse: collapse; width: 100%%; margin: 20px 0;">
                            <tr>
                                <th style="border: 1px solid ##ddd; padding: 8px; text-align: left;">Car ID</th>
                                <th style="border: 1px solid ##ddd; padding: 8px; text-align: left;">Pickup Date</th>
                                <th style="border: 1px solid ##ddd; padding: 8px; text-align: left;">Return Date</th>
                                <th style="border: 1px solid ##ddd; padding: 8px; text-align: left;">Total Amount</th>
                            </tr>
                            <tr>
                                <td style="border: 1px solid ##ddd; padding: 8px;">%s</td>
                                <td style="border: 1px solid ##ddd; padding: 8px;">%s</td>
                                <td style="border: 1px solid ##ddd; padding: 8px;">%s</td>
                                <td style="border: 1px solid ##ddd; padding: 8px;">$%.2f</td>
                            </tr>
                        </table>
                        <p>If you have any questions, feel free to contact us. We're here to help!</p>
                        <p>Best regards,</p>
                        <p><strong>Car Rental Team</strong></p>
                    </body>
                </html>
              """,
                customer.getFullName(),
                booking.getCarId(),
                booking.getPickupDate(),
                booking.getReturnDate(),
                booking.getTotalAmount()
        );
        String whatsappMessage = createWhatsAppMessage(customer, booking);
        sendEmail(customer.getEmail(), subject, body);
        if (isTwilioConfigured()) {
            if (customer.getPhoneNumber() != null && !customer.getPhoneNumber().isEmpty()) {
                sendWhatsAppMessage(customer.getPhoneNumber(), whatsappMessage);
            }

            if (manager.getPhoneNumber() != null && !manager.getPhoneNumber().isEmpty()) {
                sendWhatsAppMessage(manager.getPhoneNumber(), whatsappMessage);
            }
        } else {
            log.warn("Twilio not configured. Skipping WhatsApp notifications.");
        }
    }
    private boolean isTwilioConfigured() {
        return twilioAccountSid != null && twilioAuthToken != null &&
                !twilioAccountSid.isEmpty() && !twilioAuthToken.isEmpty() &&
                twilioWhatsAppFrom != null && !twilioWhatsAppFrom.isEmpty();
    }

    private String createWhatsAppMessage(CustomerDTO customer, BookingDTO booking) {
        return String.format(
                """
                🚗 *Car Booking Confirmation*

                Dear *%s*,

                Thank you for choosing our car rental service!

                📋 *Booking Details:*
                • Car ID: %s
                • Pickup Date: %s
                • Return Date: %s
                • Total Amount: $%.2f

                If you have any questions, feel free to contact us. We're here to help!

                Best regards,
                *Car Rental Team*
                """,
                customer.getFullName(),
                booking.getCarId(),
                booking.getPickupDate(),
                booking.getReturnDate(),
                booking.getTotalAmount()
        );
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
    private void sendWhatsAppMessage(String phoneNumber, String messageBody) {
        try {
            // Ensure phone number includes country code and proper format
            String formattedPhoneNumber = formatPhoneNumber(phoneNumber);

            Message message = Message.creator(
                    new PhoneNumber("whatsapp:" + formattedPhoneNumber),
                    new PhoneNumber(twilioWhatsAppFrom),
                    messageBody
            ).create();

            // Log WhatsApp message in database
            Notification nf = new Notification(
                    formattedPhoneNumber,
                    "WhatsApp: Booking Confirmation",
                    messageBody,
                    LocalDateTime.now()
            );
            emailLogRepository.save(nf);

            log.info("WhatsApp message sent successfully to: {} with SID: {}",
                    formattedPhoneNumber, message.getSid());
        } catch (Exception e) {
            log.error("Failed to send WhatsApp message to: {}", phoneNumber, e);
        }
    }

    private String formatPhoneNumber(String phoneNumber) {
        // Remove any non-digit characters except +
        String cleaned = phoneNumber.replaceAll("[^+\\d]", "");

        // If it doesn't start with +, assume it needs country code
        if (!cleaned.startsWith("+")) {
            // For India, use +91 (adjust based on your region)
            cleaned = "+91" + cleaned;
        }

        return cleaned;
    }

    public void sendQueryAnswer(QueryDTO queryDTO){
        String subject = String.format("Response to Your Query: %s", queryDTO.getSubject());
        String body = String.format(
                """
                <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
                            <h2>Hello %s,</h2>
                            <p>Thank you for reaching out to us. We have received your query and here is our response:</p>
        
                            <h3>Your Query</h3>
                            <p><strong>Subject:</strong> %s</p>
                            <p><strong>Category:</strong> %s</p>
                            <p><strong>Message:</strong><br>%s</p>
        
                            <h3>Our Response</h3>
                            <p>%s</p>
        
                            <p>If you have any more questions, feel free to reply to this email.</p>
                            <p>Best regards,<br>Your Company Name<br>Customer Support Team</p>
        
                            <hr style="margin-top: 30px;">
                            <p style="font-size: 12px; color: #777;">Responded at: %s</p>
                        </div>
                    </body>
                </html>
                """,
                queryDTO.getName(),
                queryDTO.getSubject(),
                queryDTO.getCategory(),
                queryDTO.getMessage(),
                queryDTO.getAnswer(),
                queryDTO.getRespondedAt() != null ? queryDTO.getRespondedAt().toString() : "N/A"
        );

        sendEmail(queryDTO.getEmail(), subject, body);
    }

    public void sendBlockReasonToCustomer(BlockReasonDTO blockReasonDTO) {
        String subject = "Account Blocked: Important Notice";
        String body = String.format(
                """
                <html>
                    <body style=\"font-family: Arial, sans-serif; line-height: 1.5; color: #333;\">
                        <h2 style=\"color: #d9534f;\">Account Blocked</h2>
                        <p>Dear <strong>%s</strong>,</p>
                        <p>We regret to inform you that your account has been blocked for the following reason:</p>
                        <blockquote style=\"background: #f8d7da; padding: 10px; border-left: 5px solid #d9534f;\">%s</blockquote>
                        <p>If you believe this is a mistake or have any questions, please contact our support team.</p>
                        <p>Best regards,<br><strong>Car Rental Team</strong></p>
                    </body>
                </html>
                """,
                blockReasonDTO.getCustomerName(),
                blockReasonDTO.getReason()
        );
        sendEmail(blockReasonDTO.getCustomerEmail(), subject, body);
        if (isTwilioConfigured() && blockReasonDTO.getCustomerEmail() != null) {
            // If you want to send WhatsApp too, you can add phone number to DTO and send here
            // Example (if phone number is added):
            // sendWhatsAppMessage(blockReasonDTO.getCustomerPhone(), "Your account has been blocked. Reason: " + blockReasonDTO.getReason());
        }
    }
}
