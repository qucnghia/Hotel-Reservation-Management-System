package com.hotel.core.model.booking;

import com.hotel.core.model.service.Service;

public class BookingDetail {
    private String detailId;
    private Service service;
    private int quantity;

    public BookingDetail() {
    }

    public BookingDetail(String detailId, Service service, int quantity) {
        this.detailId = detailId;
        this.service = service;
        this.quantity = quantity;
    }

    public double calculateSubtotal() {
        // TODO: Tính giá chi tiết
        return 0.0;
    }

    public String getDetailId() {
        return detailId;
    }

    public void setDetailId(String detailId) {
        this.detailId = detailId;
    }

    public Service getService() {
        return service;
    }

    public void setService(Service service) {
        this.service = service;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
