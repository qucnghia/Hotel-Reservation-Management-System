package com.hotel.core.model.service;

import com.hotel.core.model.booking.Booking;
import com.hotel.core.strategy.PaymentStrategy;

import java.time.LocalDateTime;

public class Invoice {
    private String invoiceId;
    private Booking booking;
    private LocalDateTime issuedAt;
    private double totalAmount;
    private double discountAmount;
    private double finalAmount;
    private boolean isPaid;

    public Invoice() {
    }

    public Invoice(String invoiceId, Booking booking) {
        this.invoiceId = invoiceId;
        this.booking = booking;
        this.issuedAt = LocalDateTime.now();
        this.isPaid = false;
    }

    public void processPayment(PaymentStrategy paymentStrategy) {
        // TODO: Xử lý thanh toán thông qua Strategy
    }

    public String getInvoiceId() {
        return invoiceId;
    }

    public void setInvoiceId(String invoiceId) {
        this.invoiceId = invoiceId;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public LocalDateTime getIssuedAt() {
        return issuedAt;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public double getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(double discountAmount) {
        this.discountAmount = discountAmount;
    }

    public double getFinalAmount() {
        return finalAmount;
    }

    public void setFinalAmount(double finalAmount) {
        this.finalAmount = finalAmount;
    }

    public boolean isPaid() {
        return isPaid;
    }

    public void setPaid(boolean paid) {
        isPaid = paid;
    }
}
