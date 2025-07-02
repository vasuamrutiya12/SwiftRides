package com.PaymentService.Controller;

import com.PaymentService.DTOs.PaymentRequest;
import com.PaymentService.DTOs.PaymentResponse;
import com.PaymentService.Entity.Payment;
import com.PaymentService.Service.PaymentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@Slf4j
public class PaymentController {


    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

//    @PostMapping("/create-session")
//    public ResponseEntity<PaymentResponse> createPaymentSession(@RequestBody PaymentRequest request) {
//        try {
//            RuntimeException response = paymentService.createPaymentSession(request);
//            return "error".equals(response.getStatus()) ?
//                    ResponseEntity.badRequest().body(response) :
//                    ResponseEntity.ok();
//        } catch (Exception e) {
//            log.error("Error creating payment session: {}", e.getMessage());
//            PaymentResponse errorResponse = new PaymentResponse();
//            errorResponse.setStatus("error");
//            errorResponse.setMessage("Internal server error");
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
//        }
//    }
@PostMapping("/create-session")
public ResponseEntity<PaymentResponse> createPaymentSession(@RequestBody PaymentRequest request) {
    try {
        PaymentResponse response = paymentService.createPaymentSession(request);
        if ("error".equals(response.getStatus())) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        log.error("Error creating payment session: {}", e.getMessage());
        PaymentResponse errorResponse = new PaymentResponse();
        errorResponse.setStatus("error");
        errorResponse.setMessage("Internal server error");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}

    @GetMapping("/{paymentId}/status")
    public ResponseEntity<PaymentResponse> getPaymentStatus(@PathVariable int paymentId) {
        try {
            PaymentResponse response = paymentService.getPaymentStatus(paymentId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting payment status: {}", e.getMessage());
            PaymentResponse errorResponse = new PaymentResponse();
            errorResponse.setStatus("error");
            errorResponse.setMessage("Payment not found");
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<Payment> getPaymentByBookingId(@PathVariable int bookingId) {
        try {
            Payment payment = paymentService.getPaymentByBookingId(bookingId);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            log.error("Error getting payment by booking ID: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/verify/{sessionId}")
    public ResponseEntity<PaymentResponse> verifyPayment(@PathVariable String sessionId) {
        try {
            PaymentResponse response = paymentService.verifyPayment(sessionId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error verifying payment: {}", e.getMessage());
            PaymentResponse errorResponse = new PaymentResponse();
            errorResponse.setStatus("error");
            errorResponse.setMessage("Error verifying payment");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @RequestMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            System.out.println("come to controller.");
            paymentService.handleWebhookEvent(payload, sigHeader);
            return ResponseEntity.ok("Webhook handled successfully");
        } catch (Exception e) {
            log.error("Error handling webhook: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Webhook handling failed");
        }
    }

    @GetMapping("/total")
    public ResponseEntity<Long> getTotalPayments() {
        try {
            Long total = paymentService.getTotalPayments();
            return ResponseEntity.ok(total);
        } catch (Exception e) {
            log.error("Error getting total payments: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/total-amount")
    public ResponseEntity<Double> getTotalAmount() {
        try {
            Double totalAmount = paymentService.getTotalAmount();
            return ResponseEntity.ok(totalAmount);
        } catch (Exception e) {
            log.error("Error getting total amount: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable int id) {
        try {
            Payment payment = paymentService.getPaymentById(id);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            log.error("Error getting payment by ID: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<Payment>> getPaymentsByCompanyId(@PathVariable int companyId) {
        try {
            List<Payment> payments = paymentService.getPaymentsByCompanyId(companyId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            log.error("Error getting payments by companyId: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}