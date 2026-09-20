package com.hotel.core.factory;

import com.hotel.core.model.service.Service;

public class ServiceFactory {

    private ServiceFactory() {
    }

    public static Service createService(String serviceId, String serviceName, double unitPrice) {
        return new Service(serviceId, serviceName, unitPrice);
    }
}
