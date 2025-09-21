package in.pandac.store.controller;

import in.pandac.store.dto.DiscountDto;
import in.pandac.store.dto.CreateDiscountRequestDto;
import in.pandac.store.dto.UpdateDiscountRequestDto;
import in.pandac.store.dto.DiscountCalculationRequestDto;
import in.pandac.store.service.DiscountService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/discount")
public class DiscountController {

    private final DiscountService discountService;

    @Autowired
    public DiscountController(DiscountService discountService) {
        this.discountService = discountService;
    }

    // Create a new discount
    @PostMapping
    public ResponseEntity<DiscountDto> createDiscount(@RequestBody DiscountDto discountDto) {
        try {
            DiscountDto createdDiscount = discountService.createDiscount(discountDto);
            return new ResponseEntity<>(createdDiscount, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // Get discount by code
    @GetMapping("/{code}")
    public ResponseEntity<DiscountDto> getDiscountByCode(@PathVariable String code) {
        Optional<DiscountDto> discount = discountService.getDiscountByCode(code);
        return discount.map(discountDto -> new ResponseEntity<>(discountDto, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Get all discounts
    @GetMapping
    public ResponseEntity<List<DiscountDto>> getAllDiscounts() {
        List<DiscountDto> discounts = discountService.allDiscounts();
        return new ResponseEntity<>(discounts, HttpStatus.OK);
    }

    // Update discount
    @PutMapping("/{code}")
    public ResponseEntity<DiscountDto> updateDiscount(@PathVariable String code, @RequestBody DiscountDto discountDto) {
        Optional<DiscountDto> updatedDiscount = discountService.updateDiscount(code, discountDto);
        return updatedDiscount.map(discountDto1 -> new ResponseEntity<>(discountDto1, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Delete discount
    @DeleteMapping("/{code}")
    public ResponseEntity<Void> deleteDiscount(@PathVariable String code) {
        boolean deleted = discountService.deleteDiscount(code);
        return deleted ? new ResponseEntity<>(HttpStatus.NO_CONTENT) 
                      : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Validate discount code
    @GetMapping("/{code}/validate")
    public ResponseEntity<Boolean> validateDiscount(@PathVariable String code) {
        boolean isValid = discountService.validateDiscount(code);
        return new ResponseEntity<>(isValid, HttpStatus.OK);
    }

    // Calculate the final price after applying discount
    @PostMapping("/calculate")
    public ResponseEntity<Double> calculateFinalPrice(@RequestParam double originalPrice, 
                                                     @RequestBody DiscountDto discountDto) {
        double finalPrice = discountService.calculateFinalPrice(originalPrice, discountDto);
        return new ResponseEntity<>(finalPrice, HttpStatus.OK);
    }
}
