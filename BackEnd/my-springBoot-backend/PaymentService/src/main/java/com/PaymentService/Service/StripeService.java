package com.PaymentService.Service;

import com.PaymentService.DTOs.StripeSessionRequest;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@ConditionalOnProperty(name = "stripe.enabled", havingValue = "true")
public class StripeService {

    @Value("${stripe.success-url}")
    private String successUrl;

    @Value("${stripe.cancel-url}")
    private String cancelUrl;


    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    public Session createCheckoutSession(StripeSessionRequest request) throws StripeException {
        // Convert amount to cents (Stripe uses smallest currency unit)
        long amountInCents = request.getAmount().multiply(BigDecimal.valueOf(100)).longValue();

        SessionCreateParams.Builder builder = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(request.getSuccessUrl() != null ? request.getSuccessUrl() : successUrl + "?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(request.getCancelUrl() != null ? request.getCancelUrl() : cancelUrl)
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency(request.getCurrency())
                                                .setUnitAmount(amountInCents)
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName("Car Rental Booking")
                                                                .setDescription(request.getDescription())
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                );

        if (request.getCustomerEmail() != null) {
            builder.setCustomerEmail(request.getCustomerEmail());
        }

        // Add metadata
        builder.putMetadata("booking_reference", request.getBookingReference());

        return Session.create(builder.build());
    }

    public Session retrieveSession(String sessionId) throws StripeException {
        return Session.retrieve(sessionId);
    }

    public Event constructEvent(String payload, String sigHeader) throws StripeException {
        try {
//            log.debug("Constructing webhook event with signature: {}",
//                    sigHeader.substring(0, Math.min(sigHeader.length(), 20)) + "...");

            // CORRECT METHOD: Use Webhook.constructEvent() not Event.construct()
            return Webhook.constructEvent(payload, sigHeader, webhookSecret);

        } catch (SignatureVerificationException e) {
//            log.error("Webhook signature verification failed: {}", e.getMessage());
            throw new IllegalArgumentException("Invalid webhook signature: " + e.getMessage(), e);
        } catch (Exception e) {
//            log.error("Error constructing webhook event: {}", e.getMessage());
            throw new RuntimeException("Error processing webhook: " + e.getMessage(), e);
        }
    }
}