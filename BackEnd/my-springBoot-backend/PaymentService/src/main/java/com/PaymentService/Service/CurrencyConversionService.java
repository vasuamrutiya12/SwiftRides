package com.PaymentService.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

@Service
@Slf4j
public class CurrencyConversionService {

    private final RestTemplate restTemplate;

    @Autowired
    public CurrencyConversionService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // Fallback exchange rates if API fails
    private static final Map<String, BigDecimal> FALLBACK_RATES = Map.of(
        "inr", BigDecimal.ONE,
        "usd", new BigDecimal("0.012"),
        "eur", new BigDecimal("0.011"),
        "gbp", new BigDecimal("0.0095"),
        "aud", new BigDecimal("0.018"),
        "cad", new BigDecimal("0.016"),
        "jpy", new BigDecimal("1.8"),
        "sgd", new BigDecimal("0.016")
    );

    public BigDecimal convertFromINR(BigDecimal amountINR, String targetCurrency) {
        try {
            // Try to get real-time exchange rates
            String url = "https://api.exchangerate-api.com/v4/latest/INR";
            ExchangeRateResponse response = restTemplate.getForObject(url, ExchangeRateResponse.class);
            
            if (response != null && response.getRates() != null) {
                BigDecimal rate = response.getRates().get(targetCurrency.toUpperCase());
                if (rate != null) {
                    return amountINR.multiply(rate).setScale(2, RoundingMode.HALF_UP);
                }
            }
        } catch (Exception e) {
            log.warn("Failed to fetch real-time exchange rates, using fallback rates: {}", e.getMessage());
        }

        // Use fallback rates if API fails
        BigDecimal rate = FALLBACK_RATES.get(targetCurrency.toLowerCase());
        if (rate == null) {
            log.warn("Unknown currency: {}, using INR rate", targetCurrency);
            rate = BigDecimal.ONE;
        }

        BigDecimal convertedAmount = amountINR.multiply(rate);
        
        // Round based on currency
        if ("jpy".equalsIgnoreCase(targetCurrency)) {
            // JPY doesn't use decimals
            return convertedAmount.setScale(0, RoundingMode.HALF_UP);
        } else {
            // Most currencies use 2 decimal places
            return convertedAmount.setScale(2, RoundingMode.HALF_UP);
        }
    }

    // Inner class for API response
    public static class ExchangeRateResponse {
        private String base;
        private String date;
        private Map<String, BigDecimal> rates;

        // Getters and setters
        public String getBase() { return base; }
        public void setBase(String base) { this.base = base; }
        
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        
        public Map<String, BigDecimal> getRates() { return rates; }
        public void setRates(Map<String, BigDecimal> rates) { this.rates = rates; }
    }
} 