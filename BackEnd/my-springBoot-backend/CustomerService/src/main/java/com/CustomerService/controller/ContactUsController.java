package com.CustomerService.controller;

import com.CustomerService.dto.ContactUsRequest;
import com.CustomerService.dto.QueryAnswerDto;
import com.CustomerService.model.ContactUs;
import com.CustomerService.service.ContactUsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    @PostMapping("/answer")
    public ResponseEntity<String> sendAnswer(@RequestBody QueryAnswerDto queryAnswerDto){
        String res = contactUsService.sendAnswer(queryAnswerDto);
        return ResponseEntity.ok(res);

    }
    @DeleteMapping("/{id}")
    public String deleteQuery(@PathVariable Long id){
        contactUsService.deleteQuery(id);
        return "Query Deleted successfully";
    }

    @GetMapping("/total")
    public ResponseEntity<Long> getTotalQueries() {
        Long total = contactUsService.getTotalQueries();
        return ResponseEntity.ok(total);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ContactUs>> getAllContactUs() {
        List<ContactUs> allContacts = contactUsService.getAllContactUs();
        return ResponseEntity.ok(allContacts);
    }

} 