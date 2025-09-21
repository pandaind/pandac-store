package in.pandac.store.service;

import in.pandac.store.dto.DiscountDto;
import in.pandac.store.entity.Discount;

import java.util.List;
import java.util.Optional;

public interface DiscountService {

    /**
     * Creates a new discount.
     *
     * @param discountDto the discount data transfer object
     * @return the created discount DTO
     */
    DiscountDto createDiscount(DiscountDto discountDto);

    /**
     * Retrieves a discount by its code.
     *
     * @param code the discount code
     * @return an Optional containing the discount DTO if found, empty otherwise
     */
    Optional<DiscountDto> getDiscountByCode(String code);

    /**
     * Retrieves a list of all available discounts.
     *
     * @return a list of Discount objects
     */
    List<DiscountDto> allDiscounts();

    /**
     * Updates an existing discount.
     *
     * @param code the discount code to update
     * @param discountDto the updated discount data
     * @return the updated discount DTO if found, empty otherwise
     */
    Optional<DiscountDto> updateDiscount(String code, DiscountDto discountDto);

    /**
     * Deletes a discount by its code.
     *
     * @param code the discount code to delete
     * @return true if the discount was deleted, false if not found
     */
    boolean deleteDiscount(String code);

    /**
     * Validates if the discount is applicable based on certain criteria.
     *
     * @param discountCode the code of the discount
     * @return true if the discount is valid, false otherwise
     */
    boolean validateDiscount(String discountCode);

    /**
     * Calculates the final price after applying the discount.
     *
     * @param originalPrice      the original price before discount
     * @param discount the Discount object containing discount details
     * @return the final price after applying the discount
     */
    double calculateFinalPrice(double originalPrice, DiscountDto discount);
}
