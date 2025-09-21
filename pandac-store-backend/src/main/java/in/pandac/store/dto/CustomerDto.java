package in.pandac.store.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.Set;

@Getter @Setter
public class CustomerDto {

    private Long customerId;
    private String name;
    private String email;
    private String mobileNumber;
    private AddressDto address;
    private Set<String> roleNames; // Only role names, not full Role objects
    
    // Audit fields
    private Instant createdAt;
    private String createdBy;
    private Instant updatedAt;
    private String updatedBy;
}
