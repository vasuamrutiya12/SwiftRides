package com.CustomerService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/customers")
public class DLVerificationController {

    @Autowired
    private RestTemplate restTemplate;

    private String normalizeName(String name) {
        if (name == null) return "";
        // Remove all non-breaking spaces, tabs, newlines, collapse multiple spaces, remove non-letter chars, lowercase
        return name
            .replaceAll("[\\u00A0\\s]+", " ") // Replace all whitespace (including non-breaking) with single space
            .replaceAll("[^\\p{L} ]", "")    // Remove non-letter characters except space
            .trim()
            .toLowerCase();
    }

    @PostMapping("/dl/verify")
    public ResponseEntity<?> verifyDL(@RequestBody DLVerificationRequest request) {
        String fastApiUrl = "http://localhost:8000/verify-dl";
        ResponseEntity<String> response = restTemplate.postForEntity(fastApiUrl, request, String.class);
        try {
            org.json.JSONObject json = new org.json.JSONObject(response.getBody());
            boolean dlNumberMatch = json.optBoolean("is_dl_number_match");
            String dlName = json.optString("extracted_name");
            String customerName = request.customerName;
            boolean nameMatch = false;
            if (dlName != null && customerName != null) {
                nameMatch = normalizeName(dlName).equals(normalizeName(customerName));
            }
            String dlDob = json.optString("extracted_dob");
            String customerDob = request.dateOfBirth;
            boolean dobMatch = false;
            try {
                if (dlDob != null && customerDob != null) {
                    LocalDate dlDate = LocalDate.parse(dlDob, DateTimeFormatter.ofPattern("dd-MM-yyyy"));
                    LocalDate customerDate = LocalDate.parse(customerDob, DateTimeFormatter.ISO_LOCAL_DATE);
                    dobMatch = dlDate.equals(customerDate);
                }
            } catch (Exception e) {
                dobMatch = false;
            }
            boolean faceMatch = json.optBoolean("face_match");
            String status = (dlNumberMatch && nameMatch && dobMatch && faceMatch) ? "verified" : "rejected";
            String message = status.equals("verified") ?
                "DL number, name, DOB, and face all match. Status: verified." :
                "DL verification failed. Status: rejected.";
            org.json.JSONObject result = new org.json.JSONObject();
            result.put("dlNumberMatch", dlNumberMatch);
            result.put("nameMatch", nameMatch);
            result.put("dobMatch", dobMatch);
            result.put("faceMatch", faceMatch);
            result.put("status", status);
            result.put("message", message);
            return ResponseEntity.ok(result.toString());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"status\":\"error\",\"message\":\"Verification failed: " + e.getMessage() + "\"}");
        }
    }

    static class DLVerificationRequest {
        public String dl_image_url;
        public String entered_dl_number;
        public String selfie_image_url;
        public String customerName;
        public String dateOfBirth;
    }
}
