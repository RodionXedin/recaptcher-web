package com.recaptcher.repository;

import com.recaptcher.entity.Customer;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Created by rodion on 29.01.2017.
 */
@Component
public interface CustomerRepository extends CrudRepository<Customer,Long> {

    List<Customer> findByLastName(String lastName);

}
