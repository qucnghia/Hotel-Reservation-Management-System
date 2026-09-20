package com.hotel.core.model.service;

public class Service {
    private String serviceId;
    private String serviceName;
    private double unitPrice;

    public Service() {
    }

    public Service(String serviceId, String serviceName, double unitPrice) {
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.unitPrice = unitPrice;
    }

    public String getServiceId() {
        return serviceId;
    }

    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(double unitPrice) {
        this.unitPrice = unitPrice;
    }
}
