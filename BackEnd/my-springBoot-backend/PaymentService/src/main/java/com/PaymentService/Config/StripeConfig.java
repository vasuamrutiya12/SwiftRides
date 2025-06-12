package com.PaymentService.Config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StripeConfig {

    @Value("${stripe.webhook.secret}")
    @NotBlank(message = "Stripe webhook secret is required")
    private String webhookSecret;

    @Value("${stripe.success-url}")
    @NotBlank(message = "Stripe success URL is required")
    private String successUrl;

    @Value("${stripe.cancel-url}")
    @NotBlank(message = "Stripe cancel URL is required")
    private String cancelUrl;

    @Value("${stripe.api.key}")
    @NotBlank(message = "Stripe API Key is required")
    private String apiKey;

    @PostConstruct
    public void initStripe() {
        Stripe.apiKey = apiKey;
    }

    // Getters for use elsewhere
    public String getWebhookSecret() {
        return webhookSecret;
    }

    public String getSuccessUrl() {
        return successUrl;
    }

    public String getCancelUrl() {
        return cancelUrl;
    }

    public String getApiKey() {
        return apiKey;
    }

    // Initialize the Stripe API Key
    @PostConstruct
    public void init() {
        Stripe.apiKey = apiKey;
        System.out.println("Stripe API initialized with key: " + apiKey);
    }
}
