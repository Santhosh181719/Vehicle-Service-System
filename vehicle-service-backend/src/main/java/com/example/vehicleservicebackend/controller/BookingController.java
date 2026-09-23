package com.example.vehicleservicebackend.controller;

import com.example.vehicleservicebackend.model.Booking;
import com.example.vehicleservicebackend.service.BookingService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }


    // =========================
    // CREATE BOOKING
    // =========================

    @PostMapping
    public Booking createBooking(
            @RequestBody Booking booking) {

        return bookingService.createBooking(booking);
    }


    // =========================
    // GET ALL BOOKINGS
    // =========================

    @GetMapping
    public List<Booking> getAllBookings() {

        return bookingService.getAllBookings();
    }


    // =========================
    // GET MY BOOKINGS
    // =========================

    @GetMapping("/my")
    public List<Booking> getMyBookings() {

        return bookingService.getMyBookings();
    }


    // =========================
    // GET BOOKING BY ID
    // =========================

    @GetMapping("/{id}")
    public Booking getBookingById(
            @PathVariable Long id) {

        return bookingService.getBookingById(id);
    }


    // =========================
    // UPDATE STATUS
    // =========================

    @PutMapping("/{id}/status")
    public Booking updateBookingStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return bookingService.updateBookingStatus(
                id,
                status
        );
    }


    // =========================
    // DELETE BOOKING
    // =========================

    @DeleteMapping("/{id}")
    public String deleteBooking(
            @PathVariable Long id) {

        bookingService.deleteBooking(id);

        return "Booking deleted successfully";
    }
}