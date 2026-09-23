package com.example.vehicleservicebackend.controller;

import com.example.vehicleservicebackend.model.Vehicle;
import com.example.vehicleservicebackend.service.VehicleService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:5173")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(
            VehicleService vehicleService) {

        this.vehicleService = vehicleService;
    }


    // =========================
    // GET MY VEHICLES
    // =========================

    @GetMapping
    public List<Vehicle> getMyVehicles() {

        return vehicleService.getMyVehicles();
    }


    // =========================
    // GET VEHICLE BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(
            @PathVariable Long id) {

        try {

            return ResponseEntity.ok(
                    vehicleService.getVehicleById(id)
            );

        } catch (RuntimeException e) {

            return ResponseEntity.notFound().build();
        }
    }


    // =========================
    // ADD VEHICLE
    // =========================

    @PostMapping
    public ResponseEntity<Vehicle> addVehicle(
            @RequestBody Vehicle vehicle) {

        return ResponseEntity.ok(
                vehicleService.addVehicle(vehicle)
        );
    }


    // =========================
    // UPDATE VEHICLE
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(
            @PathVariable Long id,
            @RequestBody Vehicle updatedVehicle) {

        try {

            return ResponseEntity.ok(
                    vehicleService.updateVehicle(
                            id,
                            updatedVehicle
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.notFound().build();
        }
    }


    // =========================
    // DELETE VEHICLE
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(
            @PathVariable Long id) {

        try {

            vehicleService.deleteVehicle(id);

            return ResponseEntity.noContent().build();

        } catch (RuntimeException e) {

            return ResponseEntity.notFound().build();
        }
    }
}