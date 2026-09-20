package com.hotel.repository;

import com.hotel.core.model.room.Room;
import java.util.List;
import java.util.Optional;

public interface IRoomRepository {
    void save(Room room);
    Optional<Room> findById(String roomId);
    Optional<Room> findByRoomNumber(String roomNumber);
    List<Room> findAll();
    void update(Room room);
    void delete(String roomId);
}
