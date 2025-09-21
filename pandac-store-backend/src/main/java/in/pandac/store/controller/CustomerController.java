package in.pandac.store.controller;

import in.pandac.store.dto.CustomerDto;
import in.pandac.store.dto.CreateCustomerRequestDto;
import in.pandac.store.dto.UpdateCustomerRequestDto;
import in.pandac.store.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    // Create a new customer
    @PostMapping
    public ResponseEntity<CustomerDto> createCustomer(@Valid @RequestBody CreateCustomerRequestDto createCustomerRequestDto) {
        try {
            CustomerDto createdCustomer = customerService.createCustomer(createCustomerRequestDto);
            return new ResponseEntity<>(createdCustomer, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // Get customer by ID
    @GetMapping("/{customerId}")
    public ResponseEntity<CustomerDto> getCustomerById(@PathVariable Long customerId) {
        Optional<CustomerDto> customer = customerService.getCustomerById(customerId);
        return customer.map(customerDto -> new ResponseEntity<>(customerDto, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Get customer by email
    @GetMapping("/email/{email}")
    public ResponseEntity<CustomerDto> getCustomerByEmail(@PathVariable String email) {
        Optional<CustomerDto> customer = customerService.getCustomerByEmail(email);
        return customer.map(customerDto -> new ResponseEntity<>(customerDto, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Get all customers
    @GetMapping
    public ResponseEntity<List<CustomerDto>> getAllCustomers() {
        List<CustomerDto> customers = customerService.getAllCustomers();
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }

    // Update customer
    @PutMapping("/{customerId}")
    public ResponseEntity<CustomerDto> updateCustomer(@PathVariable Long customerId, 
                                                     @Valid @RequestBody UpdateCustomerRequestDto updateCustomerRequestDto) {
        try {
            Optional<CustomerDto> updatedCustomer = customerService.updateCustomer(customerId, updateCustomerRequestDto);
            return updatedCustomer.map(customerDto -> new ResponseEntity<>(customerDto, HttpStatus.OK))
                    .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // Delete customer
    @DeleteMapping("/{customerId}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long customerId) {
        boolean deleted = customerService.deleteCustomer(customerId);
        return deleted ? new ResponseEntity<>(HttpStatus.NO_CONTENT) 
                      : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Update customer status (activate/deactivate)
    @PatchMapping("/{customerId}/status")
    public ResponseEntity<String> updateCustomerStatus(@PathVariable Long customerId, 
                                                       @RequestParam boolean isActive) {
        boolean updated = customerService.updateCustomerStatus(customerId, isActive);
        if (updated) {
            String status = isActive ? "activated" : "deactivated";
            return new ResponseEntity<>("Customer " + status + " successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Customer not found", HttpStatus.NOT_FOUND);
        }
    }

    // Search customers
    @GetMapping("/search")
    public ResponseEntity<List<CustomerDto>> searchCustomers(@RequestParam String searchTerm) {
        List<CustomerDto> customers = customerService.searchCustomers(searchTerm);
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }
}
