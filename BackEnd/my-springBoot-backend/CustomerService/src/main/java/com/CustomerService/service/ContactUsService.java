package com.CustomerService.service;

import com.CustomerService.Repo.ContactUsRepository;
import com.CustomerService.client.NotificationServiceClient;
import com.CustomerService.dto.ContactUsRequest;
import com.CustomerService.dto.QueryAnswerDto;
import com.CustomerService.model.ContactUs;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ContactUsService {

    @Autowired
    private ContactUsRepository contactUsRepository;

    @Autowired
    private NotificationServiceClient notificationServiceClient;

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

    public void deleteQuery(Long id){
         contactUsRepository.deleteById(id);
    }

    @Transactional
    public String sendAnswer(QueryAnswerDto queryAnswerDto){
        ContactUs actualContactus = null;
        Optional<ContactUs> contactUs = contactUsRepository.findById(queryAnswerDto.getId());
        if(contactUs.isPresent()){
             actualContactus = contactUs.get();
        }
        if(queryAnswerDto.getAnswer() != null){
            assert actualContactus != null;
            actualContactus.setAnswer(queryAnswerDto.getAnswer());
        }
        ResponseEntity<String> res= notificationServiceClient.sendQueryAnswer(actualContactus);
        return res.toString();
    }

    public List<ContactUs> getAllContactUs() {
        return contactUsRepository.findAll();
    }

} 