package com.hotel.core.strategy;

public class CreditCardPaymentStrategy implements PaymentStrategy {
    private String cardNumber;
    private String cvv;

    public CreditCardPaymentStrategy(String cardNumber, String cvv) {
        this.cardNumber = cardNumber;
        this.cvv = cvv;
    }

    @Override
    public boolean pay(double amount) {
        // TODO: Xử lý thanh toán thẻ tín dụng
        return true;
    }
}
