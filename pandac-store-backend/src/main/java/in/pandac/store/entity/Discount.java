package in.pandac.store.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "discounts")
@Getter
@Setter
public class Discount extends BaseEntity {
    @Id
    private String code;
    private int discount;
    @Enumerated(EnumType.STRING)
    private DiscountType type;

    public Discount() {}

    public Discount(String code, int discount, String type) {
        this.code = code;
        this.discount = discount;
        this.type = DiscountType.valueOf(type.toUpperCase());
    }
}