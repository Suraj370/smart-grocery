package com.suraj.smartgroceryapp.service;


import com.suraj.smartgroceryapp.dto.SigninRequest;
import com.suraj.smartgroceryapp.dto.SigninResponse;
import com.suraj.smartgroceryapp.dto.SignupRequest;
import com.suraj.smartgroceryapp.entity.User;

public interface AuthService {
    User signupUser(SignupRequest user);
    SigninResponse signinUser(SigninRequest user);

}
