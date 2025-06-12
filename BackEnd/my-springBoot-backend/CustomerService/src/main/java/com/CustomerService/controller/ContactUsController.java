package com.CustomerService.controller;

import com.CustomerService.dto.ContactUsRequest;
import com.CustomerService.model.ContactUs;
import com.CustomerService.service.ContactUsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactUsController {

    @Autowired
    private ContactUsService contactUsService;

    @PostMapping("/submit")
    public ResponseEntity<ContactUs> submitContactForm(@RequestBody ContactUsRequest request) {
        ContactUs savedContact = contactUsService.submitContactForm(request);
        return ResponseEntity.ok(savedContact);
    }

    @GetMapping("/total")
    public ResponseEntity<Long> getTotalQueries() {
        Long total = contactUsService.getTotalQueries();
        return ResponseEntity.ok(total);
    }


} 