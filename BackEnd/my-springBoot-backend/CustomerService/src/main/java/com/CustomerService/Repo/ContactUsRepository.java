package com.CustomerService.Repo;

import com.CustomerService.model.ContactUs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactUsRepository extends JpaRepository<ContactUs, Long> {
    // Add custom query methods if needed
} 