package com.sqa.project_sqa.repositories;

import com.sqa.project_sqa.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query("SELECT c FROM Comment c WHERE c.location.id = :locationId")
    List<Comment> findAllByLocationId(Long locationId);

    @Query("SELECT c FROM Comment c WHERE c.location.id = :locationId AND c.user.id = :userId")
    List<Comment> findByLocationIdAndUserId(Long locationId, int userId);
}
