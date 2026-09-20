package com.hotel.repository;

import com.hotel.core.model.booking.Booking;
import java.util.List;
import java.util.Optional;

public interface IBookingRepository {
    void save(Booking booking);
    Optional<Booking> findById(String bookingId);
    List<Booking> findAll();
}
