package com.example.vehicleservicebackend.service;

import com.example.vehicleservicebackend.model.Booking;
import com.example.vehicleservicebackend.model.User;
import com.example.vehicleservicebackend.repository.BookingRepository;
import com.example.vehicleservicebackend.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public BookingService(
            BookingRepository bookingRepository,
            UserRepository userRepository) {

        this.bookingRepository = bookingRepository;
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
                        new RuntimeException("Logged-in user not found"));
    }


    // =========================
    // CREATE BOOKING
    // =========================

    public Booking createBooking(Booking booking) {

        User user = getLoggedInUser();

        // Connect booking to logged-in customer
        booking.setUser(user);

        // Default status
        if (booking.getStatus() == null ||
                booking.getStatus().isBlank()) {

            booking.setStatus("PENDING");
        }

        return bookingRepository.save(booking);
    }


    // =========================
    // GET ALL BOOKINGS
    // ADMIN
    // =========================

    public List<Booking> getAllBookings() {

        return bookingRepository.findAll();
    }


    // =========================
    // GET MY BOOKINGS
    // CUSTOMER
    // =========================

    public List<Booking> getMyBookings() {

        User user = getLoggedInUser();

        return bookingRepository.findByUserId(user.getId());
    }


    // =========================
    // GET BOOKING BY ID
    // =========================

    public Booking getBookingById(Long id) {

        return bookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));
    }


    // =========================
    // UPDATE STATUS
    // =========================

    public Booking updateBookingStatus(
            Long id,
            String status) {

        Booking booking = getBookingById(id);

        booking.setStatus(status);

        return bookingRepository.save(booking);
    }


    // =========================
    // DELETE BOOKING
    // =========================

    public void deleteBooking(Long id) {

        bookingRepository.deleteById(id);
    }
}