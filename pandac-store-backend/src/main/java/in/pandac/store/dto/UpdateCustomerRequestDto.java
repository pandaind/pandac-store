package in.pandac.store.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCustomerRequestDto {
    
    @NotBlank(message = "Name is required")
    @Size(min = 5, max = 100, message = "Name must be between 5 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email address must be a valid value")
    private String email;

    @NotBlank(message = "Mobile Number is required")
    @Pattern(regexp = "^\\d{10}$", message = "Mobile number must be exactly 10 digits")
    private String mobileNumber;
    
    // Address fields
    private String street;
    private String city;
    private String state;
    private String postalCode;
    private String country;
}
