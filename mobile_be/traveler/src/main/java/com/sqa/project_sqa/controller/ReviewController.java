package com.sqa.project_sqa.controller;

import com.sqa.project_sqa.entities.Comment;
import com.sqa.project_sqa.entities.Review;
import com.sqa.project_sqa.entities.Location;

import com.sqa.project_sqa.repositories.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.sqa.project_sqa.repositories.ReviewRepository;
import com.sqa.project_sqa.repositories.LocationRepository;

import java.util.List;

@RestController
@CrossOrigin()
@RequestMapping("/api/v1/review")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private CommentRepository commentRepository;

    // API để lấy tất cả các đánh giá
//    @GetMapping("/getAllReviews")
//    public ResponseEntity<List<Review>> getAllReviews() {
//        List<Review> reviews = reviewRepository.findAll();
//        return new ResponseEntity<>(reviews, HttpStatus.OK);
//    }

    // API để tạo mới hoặc cập nhật đánh giá
    @PostMapping("/rating")
    public ResponseEntity<Review> createOrUpdateReview(@RequestBody Review review) {
        try {
            Review existingReview = reviewRepository.findByLocationIdAndUserId(review.getLocation().getLocationId(), review.getUser().getUserId());

            if (existingReview != null) {
                // Cập nhật bản ghi đánh giá hiện có với thông tin mới
                existingReview.setRating(review.getRating());

                Review savedReview = reviewRepository.save(existingReview);

                // Cập nhật thông tin location
                updateLocationRating(savedReview.getLocation());

                return new ResponseEntity<>(savedReview, HttpStatus.OK);
            } else {
                Review savedReview = reviewRepository.save(review);

                updateLocationRating(savedReview.getLocation());

                return new ResponseEntity<>(savedReview, HttpStatus.CREATED);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




    private void updateLocationRating(Location location) {
        try {
            // Lấy tất cả các đánh giá cho địa điểm này
            List<Review> reviews = reviewRepository.findAllByLocationId(location.getLocationId());

            if (!reviews.isEmpty()) {
                int totalRate = 0;
                double averageRating = 0.0;

                // Tính toán tổng số lần đánh giá và tổng điểm đánh giá
                for (Review review : reviews) {
                    totalRate++;
                    averageRating += review.getRating();
                }

                // Tính toán giá trị trung bình của đánh giá
                averageRating /= totalRate;

                // Cập nhật giá trị totalRate và rating mới cho địa điểm
                location.setTotalRate(totalRate);
                location.setRating(averageRating);

                locationRepository.save(location);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    // API để lấy đánh giá dựa trên locationId và userId
    @GetMapping("/rating/{locationId}/{userId}")
    public ResponseEntity<Review> getReviewByLocationIdAndUserId(@PathVariable Long locationId, @PathVariable int userId) {
        Review review = reviewRepository.findByLocationIdAndUserId(locationId, userId);
        if (review != null) {
            return new ResponseEntity<>(review, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/comments/location/{locationId}/user/{userId}")
    public ResponseEntity<List<Comment>> getCommentsByLocationAndUser(@PathVariable Long locationId, @PathVariable int userId) {
        List<Comment> comments = commentRepository.findByLocationIdAndUserId(locationId, userId);
        if (comments.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @GetMapping("/comments/location/{locationId}")
    public ResponseEntity<List<Comment>> getCommentsByLocation(@PathVariable Long locationId) {
        List<Comment> comments = commentRepository.findAllByLocationId(locationId);
        if (comments.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @GetMapping("/getAllComments")
    public ResponseEntity<List<Comment>> getAllComments() {
        List<Comment> comments = commentRepository.findAll();
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }
    // API để lấy tất cả các đánh giá dựa trên locationId


    // API để lấy tất cả các đánh giá dựa trên userId

}
