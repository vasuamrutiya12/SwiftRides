package com.PaymentService.Service;
import com.PaymentService.DTOs.*;
import com.PaymentService.Entity.Payment;
import com.PaymentService.Repository.PaymentRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingClient bookingClient;
    private final RentalCompanyClient companyClient;
    private final StripeService stripeService;
    private final NotificationServiceClient notificationServiceClient;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;
    @Value("${stripe.success-url}")
    private String successUrl;
    @Value("${stripe.cancel-url}")
    private String cancelUrl;

    private static final Logger log = LoggerFactory.getLogger(PaymentServiceImpl.class);

    public PaymentServiceImpl(PaymentRepository paymentRepository,
                              BookingClient bookingClient,
                              RentalCompanyClient companyClient,
                              StripeService stripeService, NotificationServiceClient notificationServiceClient) {
        this.paymentRepository = paymentRepository;
        this.bookingClient = bookingClient;
        this.companyClient = companyClient;
        this.stripeService = stripeService;
        this.notificationServiceClient = notificationServiceClient;
    }

    public PaymentResponse createPaymentSession(PaymentRequest request) {
        PaymentResponse response = new PaymentResponse();
        try {
            // Validate booking and company
            BookingDTO booking = bookingClient.getBookingById(request.getBookingId());
            CompanyDTO company = companyClient.getCompanyById(request.getCompanyId());

            // Create payment record
            Payment payment = new Payment();
            payment.setBookingId(request.getBookingId());
            payment.setCompanyId(request.getCompanyId());
            payment.setAmount(request.getAmount());
            payment.setPaymentMethod(request.getPaymentMethod());
            payment.setCurrency(request.getCurrency());
            payment.setCustomerEmail(request.getCustomerEmail());
            payment.setDescription(request.getDescription() != null ?
                    request.getDescription() : "Car rental booking for " + booking.getBookingReference());
            payment.setStatus(Payment.PaymentStatus.PENDING);

            // Create Stripe session request
            StripeSessionRequest sessionRequest = new StripeSessionRequest();
            sessionRequest.setAmount(request.getAmount());
            sessionRequest.setCurrency(request.getCurrency());
            sessionRequest.setCustomerEmail(request.getCustomerEmail());
            sessionRequest.setDescription(payment.getDescription());
            sessionRequest.setSuccessUrl(successUrl);
            sessionRequest.setCancelUrl(cancelUrl);
            sessionRequest.setBookingReference(booking.getBookingReference());

            // Create Stripe checkout session
            Session session = stripeService.createCheckoutSession(sessionRequest);

            payment.setStripeSessionId(session.getId());
            payment = paymentRepository.save(payment);

            // Prepare successful response
            response.setStatus("success");
            response.setMessage("Payment session created successfully");
            response.setCheckoutUrl(session.getUrl());
            response.setSessionId(session.getId());
            response.setPaymentId(payment.getId());

        } catch (StripeException e) {
            log.error("Stripe error creating payment session: {}", e.getMessage());
            response.setStatus("error");
            response.setMessage("Stripe error: " + e.getMessage());
        } catch (Exception e) {
            log.error("Error creating payment session: {}", e.getMessage());
            response.setStatus("error");
            response.setMessage("Internal server error");
        }
        return response;
    }

    @Override
    public PaymentResponse getPaymentStatus(int paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        PaymentResponse response = new PaymentResponse();
        response.setPaymentId(payment.getId());
        response.setStatus(payment.getStatus().toString().toLowerCase());
        response.setSessionId(payment.getStripeSessionId());

        if (payment.getStatus() == Payment.PaymentStatus.FAILED) {
            response.setMessage(payment.getFailureReason());
        } else {
            response.setMessage("Payment status: " + payment.getStatus());
        }

        return response;
    }

    @Override
    public Payment getPaymentByBookingId(int bookingId) {
        return paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Payment not found for booking: " + bookingId));
    }

    @Override
    public PaymentResponse verifyPayment(String sessionId) throws StripeException {
        Session session = stripeService.retrieveSession(sessionId);
        Payment payment = paymentRepository.findByStripeSessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Payment not found for session: " + sessionId));

        if ("complete".equals(session.getStatus()) && "paid".equals(session.getPaymentStatus())) {
            payment.setStatus(Payment.PaymentStatus.COMPLETED);
            payment.setStripePaymentIntentId(session.getPaymentIntent());
        } else {
            payment.setStatus(Payment.PaymentStatus.FAILED);
            payment.setFailureReason("Payment not completed in Stripe");
        }

        payment = paymentRepository.save(payment);

        PaymentResponse response = new PaymentResponse();
        response.setPaymentId(payment.getId());
        response.setStatus(payment.getStatus().toString().toLowerCase());
        response.setMessage("Payment verification completed");
        response.setSessionId(sessionId);

        return response;
    }

    @Override
    public void handleWebhookEvent(String payload, String sigHeader) {


        try {
            log.info("Received webhook event, validating signature...");

            // Use the corrected method to construct and verify the event
            Event event = Webhook.constructEvent(payload, sigHeader,webhookSecret);

            log.info("Processing webhook event: {} with ID: {}", event.getType(), event.getId());

            switch (event.getType()) {
                case "checkout.session.completed":
                    handleCheckoutSessionCompleted(event);
                    break;
                case "payment_intent.succeeded":
                    handlePaymentIntentSucceeded(event);
                    break;
                case "payment_intent.payment_failed":
                    handlePaymentIntentFailed(event);
                    break;
                case "payment_intent.canceled":
                    handlePaymentIntentCanceled(event);
                    break;
                default:
                    log.info("Unhandled event type: {}", event.getType());
            }
        } catch (StripeException e) {
            log.error("Stripe error handling webhook: {}", e.getMessage());
            throw new RuntimeException("Invalid webhook signature or processing error", e);
        } catch (Exception e) {
            log.error("Error handling webhook: {}", e.getMessage());
            throw new RuntimeException("Webhook processing failed", e);
        }
    }


    private void handleCheckoutSessionCompleted(Event event) {
        try {
            // Use Gson to properly deserialize the event data
            Session session = Session.GSON.fromJson(
                    event.getDataObjectDeserializer().getRawJson(),
                    Session.class
            );

            if (session == null) {
                log.error("Failed to deserialize checkout session from webhook");
                return;
            }

            log.info("Processing completed checkout session: {}", session.getId());

            Payment payment = paymentRepository.findByStripeSessionId(session.getId())
                    .orElse(null);

            if (payment != null) {
                payment.setStatus(Payment.PaymentStatus.COMPLETED);
                payment.setStripePaymentIntentId(session.getPaymentIntent());
                paymentRepository.save(payment);
                log.info("Updated payment status to COMPLETED for session: {}", session.getId());
                try {
                    log.info("calling to booking client 11111");
                    Map<String, String> requestBody = new HashMap<>();
                    requestBody.put("status", "SUCCESS");
                    log.info("calling to booking client 22222");
                    bookingClient.updateBookingStatus(payment.getBookingId(), requestBody);
                    log.info("Booking status updated to SUCCESS for bookingId: {}", payment.getBookingId());

                    try {
                        notificationServiceClient.sendBookingConfirmation(payment.getBookingId());
                        log.info("Booking confirmation email sent for bookingId: {}", payment.getBookingId());
                    } catch (Exception e) {
                        log.error("Failed to send booking confirmation email: {}", e.getMessage(), e);
                    }

                } catch (Exception e) {
                    log.error("Failed to update booking status: {}", e.getMessage(), e);
                }
            } else {
                log.warn("No payment found for completed session: {}", session.getId());
            }

        } catch (Exception e) {
            log.error("Error handling checkout session completed: {}", e.getMessage(), e);
        }
    }

    private void handlePaymentIntentSucceeded(Event event) {
        try {
            // Use Gson to properly deserialize the event data
            PaymentIntent paymentIntent = PaymentIntent.GSON.fromJson(
                    event.getDataObjectDeserializer().getRawJson(),
                    PaymentIntent.class
            );

            if (paymentIntent == null) {
                log.error("Failed to deserialize payment intent from webhook");
                return;
            }

            log.info("Processing successful payment intent: {}", paymentIntent.getId());

            Payment payment = paymentRepository.findByStripePaymentIntentId(paymentIntent.getId())
                    .orElse(null);

            if (payment != null) {
                payment.setStatus(Payment.PaymentStatus.COMPLETED);
                payment.setGatewayTransactionId(paymentIntent.getId());
                paymentRepository.save(payment);
                log.info("Updated payment status to COMPLETED for payment intent: {}", paymentIntent.getId());
                try {
                    log.info("calling to booking client 11111");
                    Map<String, String> requestBody = new HashMap<>();
                    requestBody.put("status", "SUCCESS");
                    log.info("calling to booking client 22222");
                    bookingClient.updateBookingStatus(payment.getBookingId(), requestBody);
                    log.info("Booking status updated to SUCCESS for bookingId: {}", payment.getBookingId());

                    try {
                        notificationServiceClient.sendBookingConfirmation(payment.getBookingId());
                        log.info("Booking confirmation email sent for bookingId: {}", payment.getBookingId());
                    } catch (Exception e) {
                        log.error("Failed to send booking confirmation email: {}", e.getMessage(), e);
                    }

                } catch (Exception e) {
                    log.error("Failed to update booking status: {}", e.getMessage(), e);
                }

            } else {
                log.warn("No payment found for payment intent: {}", paymentIntent.getId());
            }

        } catch (Exception e) {
            log.error("Error handling payment intent succeeded: {}", e.getMessage(), e);
        }
    }

    private void handlePaymentIntentFailed(Event event) {
        try {
            PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer().getObject().orElse(null);
            if (paymentIntent == null) {
                log.error("Failed to deserialize payment intent from webhook");
                return;
            }

            log.info("Processing failed payment intent: {}", paymentIntent.getId());

            Payment payment = paymentRepository.findByStripePaymentIntentId(paymentIntent.getId())
                    .orElse(null);

            if (payment != null) {
                payment.setStatus(Payment.PaymentStatus.FAILED);
                payment.setFailureReason(paymentIntent.getLastPaymentError() != null ?
                        paymentIntent.getLastPaymentError().getMessage() : "Payment failed");
                paymentRepository.save(payment);
                log.info("Updated payment status to FAILED for payment intent: {}", paymentIntent.getId());
                try {
                    Map<String, String> requestBody = new HashMap<>();
                    requestBody.put("status", "FAILED");
                    bookingClient.updateBookingStatus(payment.getBookingId(), requestBody);
                    log.info("Booking status updated to FAILED for bookingId: {}", payment.getBookingId());
                } catch (Exception e) {
                    log.error("Failed to update booking status: {}", e.getMessage(), e);
                }
            }

        } catch (Exception e) {
            log.error("Error handling payment intent failed: {}", e.getMessage());
        }
    }

    private void handlePaymentIntentCanceled(Event event) {
        try {
            PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer().getObject().orElse(null);
            if (paymentIntent == null) {
                log.error("Failed to deserialize payment intent from webhook");
                return;
            }

            log.info("Processing canceled payment intent: {}", paymentIntent.getId());

            Payment payment = paymentRepository.findByStripePaymentIntentId(paymentIntent.getId())
                    .orElse(null);

            if (payment != null) {
                payment.setStatus(Payment.PaymentStatus.CANCELLED);
                payment.setFailureReason("Payment was canceled");
                paymentRepository.save(payment);
                log.info("Updated payment status to CANCELLED for payment intent: {}", paymentIntent.getId());
                try {
                    Map<String, String> requestBody = new HashMap<>();
                    requestBody.put("status", "CANCEL");
                    bookingClient.updateBookingStatus(payment.getBookingId(), requestBody);
                    log.info("Booking status updated to CANCEL for bookingId: {}", payment.getBookingId());
                } catch (Exception e) {
                    log.error("Failed to update booking status: {}", e.getMessage(), e);
                }
            }

        } catch (Exception e) {
            log.error("Error handling payment intent canceled: {}", e.getMessage());
        }
    }

    @Override
    public Long getTotalPayments() {
        return paymentRepository.count();
    }

    @Override
    public Double getTotalAmount() {
        return paymentRepository.findAll().stream()
                .mapToDouble(payment -> payment.getAmount().doubleValue())
                .sum();
    }
}