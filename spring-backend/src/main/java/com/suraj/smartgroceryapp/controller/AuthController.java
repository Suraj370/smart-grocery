package com.suraj.smartgroceryapp.controller;

import com.suraj.smartgroceryapp.dto.SigninRequest;
import com.suraj.smartgroceryapp.dto.SigninResponse;
import com.suraj.smartgroceryapp.dto.SignupRequest;
import com.suraj.smartgroceryapp.entity.User;
import com.suraj.smartgroceryapp.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Endpoint for user registration (signing up).
     * Maps to: POST /api/auth/signup
     */
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {
        try {
            User newUser = authService.signupUser(signupRequest);
            // Return a success message and HTTP status 201 (Created)
            Map<String, String> response = new HashMap<>();
            response.put("message", "User registered successfully! ID: " + newUser.getId());
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            // Return an error message and HTTP status 400 (Bad Request)
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    /**
     * Handles user authentication (login).
     * The method signature has been corrected to return LoginResponse.
     * @param loginRequest The DTO containing username and password.
     * @return A LoginResponse containing the generated JWT token and user details.
     */
    @PostMapping("/login")
    public ResponseEntity<SigninResponse> authenticateUser(@RequestBody SigninRequest loginRequest) {
        try {
            // The service returns the structured token and user data.
            SigninResponse response = authService.signinUser(loginRequest);

            // Return the LoginResponse DTO with HTTP status 200 (OK)
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // Catches invalid username or password errors
            return new ResponseEntity(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }


}
