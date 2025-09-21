package in.pandac.store.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class DiscountAlreadyExistsException extends RuntimeException {

    public DiscountAlreadyExistsException(String discountCode) {
        super(String.format("Discount with code '%s' already exists", discountCode));
    }
}
