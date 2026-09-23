package com.example.vehicleservicebackend.service;

import com.example.vehicleservicebackend.dto.AuthRequest;
import com.example.vehicleservicebackend.dto.AuthResponse;
import com.example.vehicleservicebackend.dto.RegisterRequest;
import com.example.vehicleservicebackend.model.User;
import com.example.vehicleservicebackend.repository.UserRepository;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }


    // =========================
    // REGISTER
    // =========================

    public AuthResponse register(RegisterRequest request) {

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }


        // Create new user
        User user = new User();

        user.setName(request.getName());

        user.setEmail(request.getEmail());


        // Encrypt password
        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );


        // Default role for new users
        user.setRole("USER");


        // Save to MySQL
        userRepository.save(user);


        return new AuthResponse(
                null,
                "User registered successfully",
                user.getRole()
        );
    }


    // =========================
    // LOGIN
    // =========================

    public AuthResponse login(AuthRequest request) {

        User user =
                userRepository.findByEmail(
                                request.getEmail()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid email or password"
                                )
                        );


        // Check password
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }


        // Convert User to Spring Security UserDetails
        UserDetails userDetails =
                org.springframework.security.core.userdetails.User
                        .withUsername(user.getEmail())
                        .password(user.getPassword())
                        .roles(user.getRole())
                        .build();


        // Generate JWT
        String token =
                jwtService.generateToken(userDetails);


        // Return token + role
        return new AuthResponse(
                token,
                "Login successful",
                user.getRole()
        );
    }
}