package in.pandac.store.service.impl;

import in.pandac.store.dto.DiscountDto;
import in.pandac.store.entity.Discount;
import in.pandac.store.entity.DiscountType;
import in.pandac.store.repository.DiscountRepository;
import in.pandac.store.service.DiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DiscountServiceImpl implements DiscountService {

    private final DiscountRepository discountRepository;

    @Autowired
    public DiscountServiceImpl(DiscountRepository discountRepository) {
        this.discountRepository = discountRepository;
    }

    @Override
    public DiscountDto createDiscount(DiscountDto discountDto) {
        if (discountDto == null || discountDto.code() == null || discountDto.code().trim().isEmpty()) {
            throw new IllegalArgumentException("Discount code cannot be null or empty");
        }
        
        if (discountRepository.existsById(discountDto.code())) {
            throw new IllegalArgumentException("Discount with code '" + discountDto.code() + "' already exists");
        }
        
        Discount discount = new Discount();
        discount.setCode(discountDto.code());
        discount.setDiscount(discountDto.discount());
        discount.setType(discountDto.type());
        
        Discount savedDiscount = discountRepository.save(discount);
        return new DiscountDto(savedDiscount.getCode(), savedDiscount.getDiscount(), savedDiscount.getType());
    }

    @Override
    public Optional<DiscountDto> getDiscountByCode(String code) {
        if (code == null || code.trim().isEmpty()) {
            return Optional.empty();
        }
        
        return discountRepository.findById(code)
                .map(discount -> new DiscountDto(discount.getCode(), discount.getDiscount(), discount.getType()));
    }

    @Override
    public List<DiscountDto> allDiscounts() {
        return discountRepository.findAll().stream()
                .map(discount -> new DiscountDto(discount.getCode(), discount.getDiscount(), discount.getType()))
                .toList();
    }

    @Override
    public Optional<DiscountDto> updateDiscount(String code, DiscountDto discountDto) {
        if (code == null || code.trim().isEmpty() || discountDto == null) {
            return Optional.empty();
        }
        
        return discountRepository.findById(code)
                .map(existingDiscount -> {
                    existingDiscount.setDiscount(discountDto.discount());
                    existingDiscount.setType(discountDto.type());
                    
                    Discount updatedDiscount = discountRepository.save(existingDiscount);
                    return new DiscountDto(updatedDiscount.getCode(), updatedDiscount.getDiscount(), updatedDiscount.getType());
                });
    }

    @Override
    public boolean deleteDiscount(String code) {
        if (code == null || code.trim().isEmpty()) {
            return false;
        }
        
        if (discountRepository.existsById(code)) {
            discountRepository.deleteById(code);
            return true;
        }
        return false;
    }

    @Override
    public boolean validateDiscount(String discountCode) {
        if (discountCode == null || discountCode.isEmpty()) {
            return false;
        }
        return discountRepository.findById(discountCode).isPresent();
    }

    @Override
    public double calculateFinalPrice(double originalPrice, DiscountDto discount) {
        if (discount == null || originalPrice < 0) {
            return originalPrice; // No discount applied
        }
        if (!validateDiscount(discount.code())) {
            return originalPrice; // Invalid discount code
        }

        double discountAmount = 0.0;
        if (discount.type() == DiscountType.PERCENTAGE) {
            discountAmount = originalPrice * (discount.discount() / 100.0);
        } else if (discount.type()== DiscountType.FIXED) {
            discountAmount = originalPrice >= discount.discount() ? discount.discount() : 0.0;
        }
        return originalPrice - discountAmount;
    }
}
