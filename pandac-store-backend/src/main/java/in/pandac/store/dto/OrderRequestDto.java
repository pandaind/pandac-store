package in.pandac.store.dto;

import in.pandac.store.entity.DiscountType;

import java.math.BigDecimal;
import java.util.List;

public record OrderRequestDto(BigDecimal totalPrice,
                              String paymentId, String paymentStatus,
                              BigDecimal discount, String discountCode,
                              List<OrderItemDto> items) {
}
