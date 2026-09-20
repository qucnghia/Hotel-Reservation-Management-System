package com.hotel.core.strategy;

import com.hotel.core.model.person.Customer;

public interface DiscountStrategy {
    double calculateDiscount(double originalAmount, Customer customer);
}
