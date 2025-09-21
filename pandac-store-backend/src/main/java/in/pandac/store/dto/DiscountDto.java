package in.pandac.store.dto;

import in.pandac.store.entity.DiscountType;

public record DiscountDto(String code, int discount, DiscountType type) {}