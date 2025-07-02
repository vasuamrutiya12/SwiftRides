package com.ReviewService.repo;


import com.ReviewService.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ReviewRepo extends JpaRepository<Review,Integer> {
    List<Review> findByCarId(Integer carId);
    List<Review> findByCustomerId(Integer customerId);
    List<Review> findByCompanyId(Integer companyId);

    Long countByCarId(Integer carId);
    Long countByCustomerId(Integer customerId);
    Long countByCompanyId(Integer companyId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.carId = :carId")
    Double findAverageRatingByCarId(Integer carId);

    Optional<Review> findByCarIdAndCustomerId(Integer carId, Integer customerId);

}