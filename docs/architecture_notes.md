# TÀI LIỆU THIẾT KẾ KIẾN TRÚC & DESIGN PATTERNS

## 1. 4 Trụ Cột Hướng Đối Tượng (OOP Pillars)
- **Encapsulation**: Bảo vệ toàn vẹn dữ liệu buồng phòng, khách hàng, số dư hóa đơn.
- **Inheritance**: Cây phân cấp phòng (Room -> StandardRoom, DeluxeRoom, SuiteRoom) và con người (Person -> Customer, Employee).
- **Polymorphism**: Đa hình động khi tính giá phòng và thực thi chiến lược thanh toán.
- **Abstraction**: Interface tầng dữ liệu Repository và giao diện thanh toán Strategy.

## 2. Design Patterns
1. **Factory Method (`RoomFactory`)**: Tách biệt mã nguồn client khỏi các lớp phòng cụ thể.
2. **Singleton (`HotelManager`)**: Đảm bảo 1 phiên bản duy nhất quản trị dữ liệu phòng, chống phân mảnh bộ nhớ và xung đột lịch.
3. **Strategy (`PaymentStrategy`)**: Cho phép hoán đổi thuật toán thanh toán tại thời điểm chạy mà không vi phạm nguyên lý Open/Closed (OCP).
