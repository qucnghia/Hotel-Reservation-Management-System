package com.hotel.core.model.room;

import com.hotel.core.enums.RoomType;

public class DeluxeRoom extends Room {
    private boolean hasBalconyView;

    public DeluxeRoom() {
    }

    public DeluxeRoom(String roomId, String roomNumber, double basePrice, int floor, boolean hasBalconyView) {
        super(roomId, roomNumber, basePrice, floor);
        this.hasBalconyView = hasBalconyView;
    }

    @Override
    public double calculateTotalPrice(int numberOfDays, boolean isPeakSeason) {
        // TODO: Cài đặt công thức tính giá cho DeluxeRoom
        return 0.0;
    }

    @Override
    public RoomType getRoomType() {
        return RoomType.DELUXE;
    }

    @Override
    public String getRoomAmenities() {
        // TODO: Trả về tiện nghi phòng
        return "";
    }

    public boolean isHasBalconyView() {
        return hasBalconyView;
    }

    public void setHasBalconyView(boolean hasBalconyView) {
        this.hasBalconyView = hasBalconyView;
    }
}
