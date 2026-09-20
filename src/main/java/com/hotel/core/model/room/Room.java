package com.hotel.core.model.room;

import com.hotel.core.enums.RoomStatus;
import com.hotel.core.enums.RoomType;

public abstract class Room {
    private String roomId;
    private String roomNumber;
    private double basePrice;
    private int floor;
    private RoomStatus status;

    public Room() {
    }

    public Room(String roomId, String roomNumber, double basePrice, int floor) {
        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.basePrice = basePrice;
        this.floor = floor;
        this.status = RoomStatus.AVAILABLE;
    }

    public abstract double calculateTotalPrice(int numberOfDays, boolean isPeakSeason);
    public abstract RoomType getRoomType();
    public abstract String getRoomAmenities();

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(double basePrice) {
        this.basePrice = basePrice;
    }

    public int getFloor() {
        return floor;
    }

    public void setFloor(int floor) {
        this.floor = floor;
    }

    public RoomStatus getStatus() {
        return status;
    }

    public void setStatus(RoomStatus status) {
        this.status = status;
    }

    public boolean isAvailable() {
        return this.status == RoomStatus.AVAILABLE;
    }
}
