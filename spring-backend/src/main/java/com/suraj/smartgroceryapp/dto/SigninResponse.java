package com.suraj.smartgroceryapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SigninResponse {
    private String token;
    private UserResponse user;


}

