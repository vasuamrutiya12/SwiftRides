package com.CarService.Repository;

import com.CarService.Entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CarRepository extends JpaRepository<Car, Integer> {
    List<Car> findByCompanyId(int companyId);
    long countByStatus(String status);
    long countByCompanyId(Integer companyId);

    List<Car> findByCompanyIdAndStatus(int companyId, String status);
}
