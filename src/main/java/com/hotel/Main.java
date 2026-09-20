package com.hotel;

import com.hotel.ui.ConsoleMenu;

public class Main {
    public static void main(String[] args) {
        System.out.println("Khởi động Hệ thống Quản lý Khách sạn...");
        ConsoleMenu menu = new ConsoleMenu();
        menu.displayMainMenu();
    }
}
