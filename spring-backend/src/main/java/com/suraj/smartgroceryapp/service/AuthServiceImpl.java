package com.suraj.smartgroceryapp.service;


import com.suraj.smartgroceryapp.dto.SigninRequest;
import com.suraj.smartgroceryapp.dto.SigninResponse;
import com.suraj.smartgroceryapp.dto.SignupRequest;
import com.suraj.smartgroceryapp.dto.UserResponse;
import com.suraj.smartgroceryapp.entity.User;
import com.suraj.smartgroceryapp.repository.UserRepository;
import com.suraj.smartgroceryapp.utils.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


@Service
public class AuthServiceImpl  implements  AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtil jwtUtil;


    @Autowired
    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JWTUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public User signupUser(SignupRequest signupRequest) {
        if (userRepository.findByEmail(signupRequest.getEmail()).isPresent()) {
            // Throw a custom exception in a real application
            throw new RuntimeException("Error: Username is already taken!");
        }

        // 2. Create the User entity
        User user = new User();
        user.setEmail(signupRequest.getEmail());
        user.setDisplayName(signupRequest.getDisplayName());


        // 3. Encode the password before saving
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));

        // 4. Save the user
        return userRepository.save(user);
    }

    @Override
    public SigninResponse signinUser(SigninRequest loginRequest) {
        // 1. Find user by username
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

        // In a real API, return a generic error message for security reasons
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Error: Invalid username or password!");
        }

        User user = userOptional.get();

        // 2. Check password against the stored hash
        if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {

            // 3. Successful authentication: Generate the actual JWT token using claims
            Map<String, Object> claims = new HashMap<>();
            // Use a specific key like "userId" instead of just "user" for clarity in the token
            claims.put("userId", user.getId());

            // Assuming the JwtUtil signature is generateToken(Map<String, Object> claims, String subject)
            String token = jwtUtil.generateToken(claims, user.getEmail());

            // 4. Return the token and the user details in the LoginResponse DTO
            UserResponse userResponse = UserResponse.fromUser(user);
            return new SigninResponse(token, userResponse);
        } else {
            throw new RuntimeException("Error: Invalid username or password!");
        }
    }
}
