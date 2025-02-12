package com.sqa.project_sqa.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.sqa.project_sqa.entities.Location;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository <Location, Long>{
    @Query("SELECT l FROM Location l ORDER BY l.rating DESC")
    List<Location> findAllOrderByRatingDesc();

    @Query("SELECT l.weather FROM Location l WHERE l.locationId = ?1")
    String findWeatherIdByLocationId(Long locationId);
}
