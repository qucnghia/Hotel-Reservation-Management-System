package com.hotel.core.manager;

import com.hotel.core.enums.RoomStatus;
import com.hotel.core.model.room.Room;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class HotelManager {

    private final Map<String, Room> roomRegistry = new ConcurrentHashMap<>();

    private HotelManager() {
    }

    private static class SingletonHolder {
        private static final HotelManager INSTANCE = new HotelManager();
    }

    public static HotelManager getInstance() {
        return SingletonHolder.INSTANCE;
    }

    public void addRoom(Room room) {
        if (room != null) {
            roomRegistry.put(room.getRoomNumber(), room);
        }
    }

    public Room getRoomByNumber(String roomNumber) {
        return roomRegistry.get(roomNumber);
    }

    public List<Room> getAllRooms() {
        return new ArrayList<>(roomRegistry.values());
    }

    public List<Room> getAvailableRooms() {
        return roomRegistry.values().stream()
                .filter(r -> r.getStatus() == RoomStatus.AVAILABLE)
                .toList();
    }
}
