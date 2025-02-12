package com.sqa.project_sqa.entities;

import javax.persistence.*;
import java.util.Date; // Hoặc import java.time.LocalDateTime; nếu sử dụng LocalDateTime

@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;

    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String comment;

    @Temporal(TemporalType.TIMESTAMP) // Sử dụng TemporalType.TIMESTAMP cho java.util.Date hoặc TemporalType.TIMESTAMP hoặc TemporalType.DATE cho LocalDateTime
    private Date commentTime; // Hoặc LocalDateTime commentTime; nếu sử dụng kiểu dữ liệu LocalDateTime


    // Getters and setters
    // Constructors
    // Other methods
}
