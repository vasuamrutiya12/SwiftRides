package com.RentalCompaniesService.Repo;

import com.RentalCompaniesService.model.RentalCompany;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RentalCompanyRepo extends JpaRepository<RentalCompany,Integer> {
    List<RentalCompany> findByCityIgnoreCase(String city);

}
