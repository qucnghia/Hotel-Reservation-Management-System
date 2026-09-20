package com.hotel.core.strategy;

public class CashPaymentStrategy implements PaymentStrategy {
    @Override
    public boolean pay(double amount) {
        // TODO: Xử lý thanh toán tiền mặt
        return true;
    }
}
