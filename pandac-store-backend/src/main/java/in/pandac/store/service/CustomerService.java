package in.pandac.store.service;

import in.pandac.store.dto.CustomerDto;
import in.pandac.store.dto.CreateCustomerRequestDto;
import in.pandac.store.dto.UpdateCustomerRequestDto;

import java.util.List;
import java.util.Optional;

public interface CustomerService {

    /**
     * Creates a new customer.
     *
     * @param createCustomerRequestDto the customer data transfer object
     * @return the created customer DTO
     */
    CustomerDto createCustomer(CreateCustomerRequestDto createCustomerRequestDto);

    /**
     * Retrieves a customer by its ID.
     *
     * @param customerId the customer ID
     * @return an Optional containing the customer DTO if found, empty otherwise
     */
    Optional<CustomerDto> getCustomerById(Long customerId);

    /**
     * Retrieves a customer by email.
     *
     * @param email the customer email
     * @return an Optional containing the customer DTO if found, empty otherwise
     */
    Optional<CustomerDto> getCustomerByEmail(String email);

    /**
     * Retrieves a list of all customers.
     *
     * @return a list of customer DTOs
     */
    List<CustomerDto> getAllCustomers();

    /**
     * Updates an existing customer.
     *
     * @param customerId the customer ID to update
     * @param updateCustomerRequestDto the updated customer data
     * @return the updated customer DTO if found, empty otherwise
     */
    Optional<CustomerDto> updateCustomer(Long customerId, UpdateCustomerRequestDto updateCustomerRequestDto);

    /**
     * Deletes a customer by its ID.
     *
     * @param customerId the customer ID to delete
     * @return true if the customer was deleted, false if not found
     */
    boolean deleteCustomer(Long customerId);

    /**
     * Activates or deactivates a customer account.
     *
     * @param customerId the customer ID
     * @param isActive the new active status
     * @return true if the operation was successful, false otherwise
     */
    boolean updateCustomerStatus(Long customerId, boolean isActive);

    /**
     * Searches customers by name or email.
     *
     * @param searchTerm the search term
     * @return a list of matching customer DTOs
     */
    List<CustomerDto> searchCustomers(String searchTerm);
}
