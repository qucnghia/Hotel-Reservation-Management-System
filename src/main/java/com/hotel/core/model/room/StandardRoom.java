package com.hotel.core.model.room;

import com.hotel.core.enums.RoomType;

public class StandardRoom extends Room {

    public StandardRoom() {
    }

    public StandardRoom(String roomId, String roomNumber, double basePrice, int floor) {
        super(roomId, roomNumber, basePrice, floor);
    }

    @Override
    public double calculateTotalPrice(int numberOfDays, boolean isPeakSeason) {
        // TODO: Cài đặt công thức tính giá cho StandardRoom
        return 0.0;
    }

    @Override
    public RoomType getRoomType() {
        return RoomType.STANDARD;
    }

    @Override
    public String getRoomAmenities() {
        // TODO: Trả về tiện nghi phòng
        return "";
    }
}
