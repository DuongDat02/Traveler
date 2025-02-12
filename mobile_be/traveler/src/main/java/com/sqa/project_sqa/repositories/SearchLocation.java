package com.sqa.project_sqa.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.sqa.project_sqa.entities.Location;
import java.util.List;
import org.springframework.data.jpa.repository.Query;

public interface SearchLocation extends JpaRepository <Location, Long>{
    @Query("SELECT l FROM Location l WHERE l.name LIKE %:keyword%")
    List<Location> findAllByNameContainingKeyword(String keyword);

}
