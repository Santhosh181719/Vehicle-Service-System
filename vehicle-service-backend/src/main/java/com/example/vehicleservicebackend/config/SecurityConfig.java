package com.example.vehicleservicebackend.config;

import com.example.vehicleservicebackend.service.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

                // =========================
                // DISABLE CSRF
                // =========================

                .csrf(csrf -> csrf.disable())


                // =========================
                // ENABLE CORS
                // =========================

                .cors(cors -> {})


                // =========================
                // STATELESS SESSION
                // =========================

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )


                // =========================
                // AUTHORIZATION
                // =========================

                .authorizeHttpRequests(auth -> auth


                        // =========================
                        // LOGIN + REGISTER
                        // =========================

                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()


                        // =========================
                        // VEHICLE APIs
                        // =========================
                        // Keep public for now
                        // because vehicle creation
                        // currently does not use JWT

                        .requestMatchers(
                                "/api/vehicles/**"
                        ).permitAll()


                        // =========================
                        // BOOKING APIs
                        // =========================
                        // JWT REQUIRED

                        .requestMatchers(
                                "/api/bookings/**"
                        ).authenticated()


                        // =========================
                        // ADMIN APIs
                        // =========================

                        .requestMatchers(
                                "/api/admin/**"
                        ).permitAll()


                        // =========================
                        // USER APIs
                        // =========================

                        .requestMatchers(
                                "/api/users/**"
                        ).permitAll()


                        // =========================
                        // EVERYTHING ELSE
                        // =========================

                        .anyRequest().permitAll()
                )


                // =========================
                // JWT FILTER
                // =========================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }


    // =========================
    // PASSWORD ENCODER
    // =========================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }
}