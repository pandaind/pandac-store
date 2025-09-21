package in.pandac.store.dto;

public record DiscountCalculationRequestDto(
        double originalPrice,
        String discountCode
) {}
