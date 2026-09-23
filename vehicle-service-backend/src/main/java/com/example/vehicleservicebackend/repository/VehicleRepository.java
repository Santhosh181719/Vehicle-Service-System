package com.example.vehicleservicebackend.repository;

import com.example.vehicleservicebackend.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VehicleRepository
        extends JpaRepository<Vehicle, Long> {

    List<Vehicle> findByUserId(Long userId);
}