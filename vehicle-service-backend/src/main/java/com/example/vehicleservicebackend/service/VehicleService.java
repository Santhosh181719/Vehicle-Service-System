package com.example.vehicleservicebackend.service;

import com.example.vehicleservicebackend.model.User;
import com.example.vehicleservicebackend.model.Vehicle;
import com.example.vehicleservicebackend.repository.UserRepository;
import com.example.vehicleservicebackend.repository.VehicleRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    public VehicleService(
            VehicleRepository vehicleRepository,
            UserRepository userRepository) {

        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
    }


    // =========================
    // GET LOGGED-IN USER
    // =========================

    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication.getName().equals("anonymousUser")) {

            throw new RuntimeException("User not logged in");
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Logged-in user not found"
                        ));
    }


    // =========================
    // ADD VEHICLE
    // =========================

    public Vehicle addVehicle(Vehicle vehicle) {

        User user = getLoggedInUser();

        // Connect vehicle to logged-in user
        vehicle.setUser(user);

        return vehicleRepository.save(vehicle);
    }


    // =========================
    // GET MY VEHICLES
    // =========================

    public List<Vehicle> getMyVehicles() {

        User user = getLoggedInUser();

        return vehicleRepository.findByUserId(
                user.getId()
        );
    }


    // =========================
    // GET VEHICLE BY ID
    // =========================

    public Vehicle getVehicleById(Long id) {

        User user = getLoggedInUser();

        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Vehicle not found"
                        ));

        // Make sure vehicle belongs to logged-in user
        if (vehicle.getUser() == null ||
                !vehicle.getUser().getId().equals(user.getId())) {

            throw new RuntimeException(
                    "You are not allowed to access this vehicle"
            );
        }

        return vehicle;
    }


    // =========================
    // UPDATE VEHICLE
    // =========================

    public Vehicle updateVehicle(
            Long id,
            Vehicle updatedVehicle) {

        Vehicle vehicle = getVehicleById(id);

        vehicle.setVehicleNumber(
                updatedVehicle.getVehicleNumber()
        );

        vehicle.setBrand(
                updatedVehicle.getBrand()
        );

        vehicle.setModel(
                updatedVehicle.getModel()
        );

        vehicle.setVehicleType(
                updatedVehicle.getVehicleType()
        );

        return vehicleRepository.save(vehicle);
    }


    // =========================
    // DELETE VEHICLE
    // =========================

    public void deleteVehicle(Long id) {

        Vehicle vehicle = getVehicleById(id);

        vehicleRepository.delete(vehicle);
    }
}