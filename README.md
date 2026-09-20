# 🏨 Hotel Reservation & Management System (OOP Capstone Project)

[![Java](https://img.shields.io/badge/Java-17%2B-orange.svg)](https://www.oracle.com/java/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Architecture: Clean OOP](https://img.shields.io/badge/Design-GoF%20Patterns-brightgreen.svg)]()

Hệ thống quản lý buồng phòng, vận hành dịch vụ và đặt phòng khách sạn thông minh, giải quyết triệt để bài toán **Overbooking** và **Phân loại kiểm soát rủi ro khách hàng (Blacklist / VIP Whitelist)** theo đúng các nguyên lý Lập trình hướng đối tượng (OOP).

---

## 📌 Cấu Trúc Dự Án (Project Structure)

```text
hotel-management-system/
├── .github/
│   └── workflows/
│       └── ci.yml                 # CI workflow tự động build & test
├── docs/
│   └── architecture_notes.md      # Tài liệu kiến trúc và giải thích Design Patterns
├── src/
│   ├── main/
│   │   ├── java/com/hotel/
│   │   │   ├── core/              # Lõi nghiệp vụ hướng đối tượng (Domain Layer)
│   │   │   │   ├── model/         # Các Entity trừu tượng và kế thừa
│   │   │   │   │   ├── room/      # Room, StandardRoom, DeluxeRoom, SuiteRoom
│   │   │   │   │   ├── person/    # Person, Customer, Employee
│   │   │   │   │   ├── booking/   # Booking, BookingDetail
│   │   │   │   │   └── service/   # Service, Invoice
│   │   │   │   ├── enums/         # RoomStatus, RoomType, MembershipLevel...
│   │   │   │   ├── factory/       # RoomFactory, ServiceFactory
│   │   │   │   ├── strategy/      # PaymentStrategy, DiscountStrategy
│   │   │   │   └── manager/       # HotelManager (Singleton)
│   │   │   ├── repository/        # Tầng lưu trữ trừu tượng (File I/O / DB)
│   │   │   ├── ui/                # Tầng giao diện người dùng (Console CLI / GUI)
│   │   │   └── Main.java          # Entry point khởi chạy ứng dụng
│   │   └── resources/
│   │       ├── data/              # File dữ liệu mẫu: rooms.json, customers.json
│   │       └── application.properties
│   └── test/
│       └── java/com/hotel/        # Unit Tests (JUnit 5)
│           ├── RoomPricingTest.java
│           └── BookingConflictTest.java
├── .gitignore
├── pom.xml
├── LICENSE
└── README.md
```

---

## 🎯 Ứng Dụng Các Nguyên Lý Hướng Đối Tượng (OOP Mapping)

| Đặc trưng / Pattern | Hiện thực chi tiết trong Source Code |
| :--- | :--- |
| **Đóng gói (Encapsulation)** | Toàn bộ thuộc tính của `Room`, `Customer`, `Booking` đặt `private`/`protected`; xác thực giá trị qua phương thức nghiệp vụ. |
| **Kế thừa (Inheritance)** | `StandardRoom`, `DeluxeRoom`, `SuiteRoom` kế thừa từ lớp trừu tượng `Room`; tái sử dụng mã nguồn. |
| **Đa hình (Polymorphism)** | Phương thức `calculateTotalPrice()` được override ở các lớp con; xử lý danh sách `List<Room>` đồng nhất tại runtime. |
| **Trừu tượng (Abstraction)** | Lớp trừu tượng `Room`, `Person`, các interface `PaymentStrategy`, `IRoomRepository` che giấu chi tiết xử lý. |
| **Factory Pattern** | `RoomFactory` đóng gói toàn bộ logic khởi tạo đối tượng phòng theo `RoomType`. |
| **Singleton Pattern** | `HotelManager` áp dụng Bill Pugh Singleton điều phối trạng thái phòng và dữ liệu toàn cục thread-safe. |
| **Strategy Pattern** | Áp dụng cho các phương thức thanh toán linh hoạt: `CashPaymentStrategy`, `CreditCardPaymentStrategy`. |

---

## 🚀 Hướng Dẫn Biên Dịch & Khởi Chạy

### Yêu cầu môi trường:
- **JDK**: Java Development Kit 17 trở lên.
- **Maven**: Apache Maven 3.8+.

### Các lệnh thực thi:
```bash
# 1. Biên dịch dự án
mvn clean compile

# 2. Chạy toàn bộ Unit Tests
mvn test

# 3. Chạy chương trình chính
mvn exec:java -Dexec.mainClass="com.hotel.Main"
```
