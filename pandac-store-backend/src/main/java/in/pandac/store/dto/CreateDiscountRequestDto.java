package in.pandac.store.dto;

import in.pandac.store.entity.DiscountType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateDiscountRequestDto(
        @NotBlank(message = "Discount code is required")
        String code,
        
        @Positive(message = "Discount value must be positive")
        int discount,
        
        @NotNull(message = "Discount type is required")
        DiscountType type
) {}
