package com.hotel.repository;

import com.hotel.core.model.person.Customer;
import java.util.List;
import java.util.Optional;

public interface ICustomerRepository {
    void save(Customer customer);
    Optional<Customer> findById(String customerId);
    List<Customer> findAll();
}
