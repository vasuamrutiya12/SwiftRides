package com.gateway.security;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    public static final List<String> openApiEndpoints = List.of(
            "/auth/login",
            "/auth/user/{userId}",
            "/auth/forgot-password/send-otp",
            "/auth/forgot-password/verify-otp",
            "/auth/forgot-password/reset",
            "/auth/validate",
            "/auth/register/initiate",
            "/auth/register/verify",
            "/eureka",
            "/api/rental-company",
            "/api/search",
            "/api/reviews"
    );

    public Predicate<ServerHttpRequest> isSecured =
            request -> openApiEndpoints
                    .stream()
                    .noneMatch(uri -> request.getURI().getPath().contains(uri));

}

