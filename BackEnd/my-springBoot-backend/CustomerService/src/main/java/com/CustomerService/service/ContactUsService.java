package com.CustomerService.service;

import com.CustomerService.Repo.ContactUsRepository;
import com.CustomerService.dto.ContactUsRequest;
import com.CustomerService.model.ContactUs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ContactUsService {

    @Autowired
    private ContactUsRepository contactUsRepository;

    public ContactUs submitContactForm(ContactUsRequest request) {
        ContactUs contactUs = new ContactUs();
        contactUs.setName(request.getName());
        contactUs.setEmail(request.getEmail());
        contactUs.setSubject(request.getSubject());
        contactUs.setCategory(request.getCategory());
        contactUs.setMessage(request.getMessage());
        
        return contactUsRepository.save(contactUs);
    }

    public Long getTotalQueries() {
        // Implementation of getTotalQueries method
        return contactUsRepository.count(); // Placeholder return, actual implementation needed
    }


} 