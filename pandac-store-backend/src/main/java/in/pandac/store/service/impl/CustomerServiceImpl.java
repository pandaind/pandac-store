package in.pandac.store.service.impl;

import in.pandac.store.dto.AddressDto;
import in.pandac.store.dto.CustomerDto;
import in.pandac.store.dto.CreateCustomerRequestDto;
import in.pandac.store.dto.UpdateCustomerRequestDto;
import in.pandac.store.entity.Address;
import in.pandac.store.entity.Customer;
import in.pandac.store.entity.Role;
import in.pandac.store.repository.CustomerRepository;
import in.pandac.store.repository.RoleRepository;
import in.pandac.store.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public CustomerDto createCustomer(CreateCustomerRequestDto createCustomerRequestDto) {
        if (createCustomerRequestDto == null || createCustomerRequestDto.getEmail() == null || 
            createCustomerRequestDto.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Customer email cannot be null or empty");
        }
        
        // Check if customer already exists
        if (customerRepository.findByEmailOrMobileNumber(createCustomerRequestDto.getEmail(), 
                createCustomerRequestDto.getMobileNumber()).isPresent()) {
            throw new IllegalArgumentException("Customer with email or mobile number already exists");
        }
        
        Customer customer = new Customer();
        BeanUtils.copyProperties(createCustomerRequestDto, customer);
        customer.setPasswordHash(passwordEncoder.encode(createCustomerRequestDto.getPassword()));
        
        // Set default role
        roleRepository.findByName("ROLE_USER").ifPresent(role -> customer.setRoles(Set.of(role)));
        
        // Create address if provided
        if (createCustomerRequestDto.getStreet() != null && !createCustomerRequestDto.getStreet().trim().isEmpty()) {
            Address address = new Address();
            address.setStreet(createCustomerRequestDto.getStreet());
            address.setCity(createCustomerRequestDto.getCity());
            address.setState(createCustomerRequestDto.getState());
            address.setPostalCode(createCustomerRequestDto.getPostalCode());
            address.setCountry(createCustomerRequestDto.getCountry());
            address.setCustomer(customer);
            customer.setAddress(address);
        }
        
        Customer savedCustomer = customerRepository.save(customer);
        return convertToDto(savedCustomer);
    }

    @Override
    public Optional<CustomerDto> getCustomerById(Long customerId) {
        if (customerId == null) {
            return Optional.empty();
        }
        
        return customerRepository.findByIdWithRolesAndAddress(customerId)
                .map(this::convertToDto);
    }

    @Override
    public Optional<CustomerDto> getCustomerByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return Optional.empty();
        }
        
        return customerRepository.findByEmailWithRolesAndAddress(email)
                .map(this::convertToDto);
    }

    @Override
    public List<CustomerDto> getAllCustomers() {
        return customerRepository.findAllWithRolesAndAddress().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<CustomerDto> updateCustomer(Long customerId, UpdateCustomerRequestDto updateCustomerRequestDto) {
        if (customerId == null || updateCustomerRequestDto == null) {
            return Optional.empty();
        }
        
        return customerRepository.findByIdWithRolesAndAddress(customerId)
                .map(existingCustomer -> {
                    // Check if email is being changed and if it's already taken by another customer
                    if (!existingCustomer.getEmail().equals(updateCustomerRequestDto.getEmail())) {
                        Optional<Customer> emailExists = customerRepository.findByEmail(updateCustomerRequestDto.getEmail());
                        if (emailExists.isPresent() && !emailExists.get().getCustomerId().equals(customerId)) {
                            throw new IllegalArgumentException("Email is already taken by another customer");
                        }
                    }
                    
                    // Check if mobile number is being changed and if it's already taken by another customer
                    if (!existingCustomer.getMobileNumber().equals(updateCustomerRequestDto.getMobileNumber())) {
                        Optional<Customer> mobileExists = customerRepository.findByEmailOrMobileNumber(null, updateCustomerRequestDto.getMobileNumber());
                        if (mobileExists.isPresent() && !mobileExists.get().getCustomerId().equals(customerId)) {
                            throw new IllegalArgumentException("Mobile number is already taken by another customer");
                        }
                    }
                    
                    // Update customer fields
                    existingCustomer.setName(updateCustomerRequestDto.getName());
                    existingCustomer.setEmail(updateCustomerRequestDto.getEmail());
                    existingCustomer.setMobileNumber(updateCustomerRequestDto.getMobileNumber());
                    
                    // Update address
                    Address address = existingCustomer.getAddress();
                    if (address == null) {
                        address = new Address();
                        address.setCustomer(existingCustomer);
                    }
                    address.setStreet(updateCustomerRequestDto.getStreet());
                    address.setCity(updateCustomerRequestDto.getCity());
                    address.setState(updateCustomerRequestDto.getState());
                    address.setPostalCode(updateCustomerRequestDto.getPostalCode());
                    address.setCountry(updateCustomerRequestDto.getCountry());
                    existingCustomer.setAddress(address);
                    
                    Customer updatedCustomer = customerRepository.save(existingCustomer);
                    return convertToDto(updatedCustomer);
                });
    }

    @Override
    public boolean deleteCustomer(Long customerId) {
        if (customerId == null) {
            return false;
        }
        
        if (customerRepository.existsById(customerId)) {
            customerRepository.deleteById(customerId);
            return true;
        }
        return false;
    }

    @Override
    public boolean updateCustomerStatus(Long customerId, boolean isActive) {
        // This method can be implemented when we add an 'active' field to Customer entity
        // For now, we'll return true as a placeholder
        return customerRepository.existsById(customerId);
    }

    @Override
    public List<CustomerDto> searchCustomers(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllCustomers();
        }
        
        // Use the proper repository method that handles JOIN FETCH to avoid circular references
        return customerRepository.findAllWithRolesAndAddress().stream()
                .filter(customer -> 
                    customer.getName().toLowerCase().contains(searchTerm.toLowerCase()) ||
                    customer.getEmail().toLowerCase().contains(searchTerm.toLowerCase())
                )
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private CustomerDto convertToDto(Customer customer) {
        CustomerDto customerDto = new CustomerDto();
        BeanUtils.copyProperties(customer, customerDto);
        
        // Convert address if present
        if (customer.getAddress() != null) {
            AddressDto addressDto = new AddressDto();
            BeanUtils.copyProperties(customer.getAddress(), addressDto);
            customerDto.setAddress(addressDto);
        }
        
        // Set role names only to avoid circular reference
        if (customer.getRoles() != null) {
            Set<String> roleNames = customer.getRoles().stream()
                    .map(role -> role.getName())
                    .collect(java.util.stream.Collectors.toSet());
            customerDto.setRoleNames(roleNames);
        }
        
        return customerDto;
    }
}
