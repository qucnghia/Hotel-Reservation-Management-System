package com.hotel.core.factory;

import com.hotel.core.enums.RoomType;
import com.hotel.core.model.room.DeluxeRoom;
import com.hotel.core.model.room.Room;
import com.hotel.core.model.room.StandardRoom;
import com.hotel.core.model.room.SuiteRoom;

public class RoomFactory {

    private RoomFactory() {
    }

    public static Room createRoom(RoomType type, String roomId, String roomNumber, double basePrice, int floor) {
        return switch (type) {
            case STANDARD -> new StandardRoom(roomId, roomNumber, basePrice, floor);
            case DELUXE -> new DeluxeRoom(roomId, roomNumber, basePrice, floor, true);
            case SUITE -> new SuiteRoom(roomId, roomNumber, basePrice, floor, true);
            default -> throw new IllegalArgumentException("Loại phòng không hỗ trợ: " + type);
        };
    }
}
