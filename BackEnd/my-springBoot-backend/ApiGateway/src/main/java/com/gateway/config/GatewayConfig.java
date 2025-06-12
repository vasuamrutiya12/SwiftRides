package com.gateway.config;

import com.gateway.security.AuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class GatewayConfig {

    @Autowired
    private AuthenticationFilter authenticationFilter;

    @Bean
    public RestTemplate template(){
        return new RestTemplate();
    }

    @Bean
    public RouteLocator customRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                // Route for Search Service
                .route("SEARCH-SERVICE", r -> r
                        .path("/api/search/**")
                        .filters(f -> f.filter(authenticationFilter.apply(new AuthenticationFilter.Config())))
                        .uri("lb://SEARCH-SERVICE"))

                // Route for Customer Service
                .route("CUSTOMER-SERVICE", r -> r
                        .path("/api/customers/**","/api/contact/**")
                        .filters(f -> f.filter(authenticationFilter.apply(new AuthenticationFilter.Config())))
                        .uri("lb://CUSTOMER-SERVICE"))

                // Route for Rental Company Service
                .route("RENTAL-COMPANY-SERVICE", r -> r
                        .path("/api/rental-company/**")
                        .filters(f -> f.filter(authenticationFilter.apply(new AuthenticationFilter.Config())))
                        .uri("lb://RENTAL-COMPANY-SERVICE"))

                // Route for Car Service
                .route("CAR-SERVICE", r -> r
                        .path("/api/cars/**")
                        .filters(f -> f.filter(authenticationFilter.apply(new AuthenticationFilter.Config())))
                        .uri("lb://CAR-SERVICE"))

                // Route for Booking Service
                .route("BOOKING-SERVICE", r -> r
                        .path("/api/bookings/**")
                        .filters(f -> f.filter(authenticationFilter.apply(new AuthenticationFilter.Config())))
                        .uri("lb://BOOKING-SERVICE"))

                // Route for Identity/Auth Service (no filter, typically public)
                .route("USER-SERVICE", r -> r
                        .path("/auth/**")
                        .uri("lb://USER-SERVICE"))

                .route("INVENTORY-SERVICE", r -> r
                        .path("/api/inventory/**")
                        .filters(f -> f.filter(authenticationFilter.apply(new AuthenticationFilter.Config())))
                        .uri("lb://INVENTORY-SERVICE"))

                .route("PAYMENT-SERVICE", r -> r
                        .path("/api/payments/**")
                        .filters(f -> f.filter(authenticationFilter.apply(new AuthenticationFilter.Config())))
                        .uri("lb://PAYMENT-SERVICE"))

                .route("NOTIFICATION-SERVICE", r -> r
                        .path("/api/notification/**")
                        .filters(f -> f.filter(authenticationFilter.apply(new AuthenticationFilter.Config())))
                        .uri("lb://NOTIFICATION-SERVICE"))

                .route("REVIEW-SERVICE", r -> r
                        .path("/api/reviews/**")
                        .filters(f -> f.filter(authenticationFilter.apply(new AuthenticationFilter.Config())))
                        .uri("lb://REVIEW-SERVICE"))
                .build();
    }

    @Bean
    public CorsWebFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }




}
