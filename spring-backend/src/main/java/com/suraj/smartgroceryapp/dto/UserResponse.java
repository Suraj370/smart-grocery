package com.suraj.smartgroceryapp.dto;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.suraj.smartgroceryapp.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private String displayName;

    private Instant createdAt;  // Now Instant

    private Instant updatedAt;

    // Factory method updated for Instant
    public static UserResponse fromUser(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getDisplayName(),
                user.getCreatedAt(),  // Assuming User now has Instant fields too
                user.getUpdatedAt()
        );
    }
}