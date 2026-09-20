package com.hotel.core.model.booking;

import com.hotel.core.enums.BookingStatus;
import com.hotel.core.model.person.Customer;
import com.hotel.core.model.room.Room;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class Booking {
    private String bookingId;
    private Customer customer;
    private Room room;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private BookingStatus status;
    private List<BookingDetail> details;

    public Booking() {
        this.details = new ArrayList<>();
    }

    public Booking(String bookingId, Customer customer, Room room, LocalDate checkInDate, LocalDate checkOutDate) {
        this.bookingId = bookingId;
        this.customer = customer;
        this.room = room;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.status = BookingStatus.PENDING;
        this.details = new ArrayList<>();
    }

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public LocalDate getCheckInDate() {
        return checkInDate;
    }

    public void setCheckInDate(LocalDate checkInDate) {
        this.checkInDate = checkInDate;
    }

    public LocalDate getCheckOutDate() {
        return checkOutDate;
    }

    public void setCheckOutDate(LocalDate checkOutDate) {
        this.checkOutDate = checkOutDate;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public List<BookingDetail> getDetails() {
        return details;
    }

    public void addDetail(BookingDetail detail) {
        this.details.add(detail);
    }
}
