package com.hotel.core.model.room;

import com.hotel.core.enums.RoomType;

public class SuiteRoom extends Room {
    private boolean hasButlerService;

    public SuiteRoom() {
    }

    public SuiteRoom(String roomId, String roomNumber, double basePrice, int floor, boolean hasButlerService) {
        super(roomId, roomNumber, basePrice, floor);
        this.hasButlerService = hasButlerService;
    }

    @Override
    public double calculateTotalPrice(int numberOfDays, boolean isPeakSeason) {
        // TODO: Cài đặt công thức tính giá cho SuiteRoom
        return 0.0;
    }

    @Override
    public RoomType getRoomType() {
        return RoomType.SUITE;
    }

    @Override
    public String getRoomAmenities() {
        // TODO: Trả về tiện nghi phòng
        return "";
    }

    public boolean isHasButlerService() {
        return hasButlerService;
    }

    public void setHasButlerService(boolean hasButlerService) {
        this.hasButlerService = hasButlerService;
    }
}
