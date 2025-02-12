package com.sqa.project_sqa.repositories;

import com.sqa.project_sqa.entities.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    // Custom query to find review by locationId and userId using JPQL
    @Query("SELECT r FROM Review r WHERE r.location.id = :locationId AND r.user.id = :userId")
    Review findByLocationIdAndUserId(Long locationId, int userId);

    // Custom query to find all reviews by locationId using JPQL
    @Query("SELECT r FROM Review r WHERE r.location.id = :locationId")
    List<Review> findAllByLocationId(Long locationId);

}
