package com.example.vehicleservicebackend.controller;

import com.example.vehicleservicebackend.dto.AuthRequest;
import com.example.vehicleservicebackend.dto.AuthResponse;
import com.example.vehicleservicebackend.dto.RegisterRequest;
import com.example.vehicleservicebackend.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(
                authService.register(request)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody AuthRequest request) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }
}