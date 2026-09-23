package com.example.vehicleservicebackend.controller;

import com.example.vehicleservicebackend.model.Booking;
import com.example.vehicleservicebackend.model.User;
import com.example.vehicleservicebackend.model.Vehicle;
import com.example.vehicleservicebackend.repository.BookingRepository;
import com.example.vehicleservicebackend.repository.UserRepository;
import com.example.vehicleservicebackend.repository.VehicleRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final BookingRepository bookingRepository;


    public AdminController(
            UserRepository userRepository,
            VehicleRepository vehicleRepository,
            BookingRepository bookingRepository) {

        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.bookingRepository = bookingRepository;
    }


    // =========================
    // GET ALL USERS
    // =========================

    @GetMapping("/users")
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }


    // =========================
    // DELETE USER
    // =========================

    @DeleteMapping("/users/{id}")
    public String deleteUser(
            @PathVariable Long id) {

        if (!userRepository.existsById(id)) {

            throw new RuntimeException(
                    "User not found"
            );
        }

        userRepository.deleteById(id);

        return "User deleted successfully";
    }


    // =========================
    // GET ALL VEHICLES
    // =========================

    @GetMapping("/vehicles")
    public List<Vehicle> getAllVehicles() {

        return vehicleRepository.findAll();
    }


    // =========================
    // GET ALL BOOKINGS
    // =========================

    @GetMapping("/bookings")
    public List<Booking> getAllBookings() {

        return bookingRepository.findAll();
    }


    // =========================
    // UPDATE BOOKING STATUS
    // =========================

    @PutMapping("/bookings/{id}/status")
    public Booking updateBookingStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        Booking booking =
                bookingRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found"
                                )
                        );

        booking.setStatus(status);

        return bookingRepository.save(booking);
    }


    // =========================
    // DELETE BOOKING
    // =========================

    @DeleteMapping("/bookings/{id}")
    public String deleteBooking(
            @PathVariable Long id) {

        if (!bookingRepository.existsById(id)) {

            throw new RuntimeException(
                    "Booking not found"
            );
        }

        bookingRepository.deleteById(id);

        return "Booking deleted successfully";
    }
}