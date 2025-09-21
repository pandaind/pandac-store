import { createSlice } from "@reduxjs/toolkit";
import { APP_CONFIG } from "../config/index.js";
import { storage } from "../utils/index.js";

const initialState = storage.get(APP_CONFIG.CART_STORAGE_KEY, {
    items: [],
    appliedCoupon: null,
});

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart(state, action) {
            const { product, quantity } = action.payload;
            const existingItem = state.items.find(
                (item) => item.productId === product.productId
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.items.push({ ...product, quantity });
            }
            storage.set(APP_CONFIG.CART_STORAGE_KEY, state);
        },

        removeFromCart(state, action) {
            const { productId } = action.payload;
            state.items = state.items.filter((item) => item.productId !== productId);
            storage.set(APP_CONFIG.CART_STORAGE_KEY, state);
        },

        updateQuantity(state, action) {
            const { productId, quantity } = action.payload;
            const item = state.items.find((item) => item.productId === productId);
            if (item && quantity > 0) {
                item.quantity = quantity;
                storage.set(APP_CONFIG.CART_STORAGE_KEY, state);
            }
        },

        clearCart(state) {
            state.items = [];
            state.appliedCoupon = null;
            storage.remove(APP_CONFIG.CART_STORAGE_KEY);
        },

        addCoupon(state, action) {
            const coupon = action.payload;
            if (coupon && typeof coupon === "object") {
                state.appliedCoupon = coupon;
                storage.set(APP_CONFIG.CART_STORAGE_KEY, state);
            } else {
                console.error("Invalid coupon format");
            }
        },

        removeCoupon(state) {
            state.appliedCoupon = null;
            storage.set(APP_CONFIG.CART_STORAGE_KEY, state);
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addCoupon,
    removeCoupon
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state) => state.cart.items;

export const selectAppliedCoupon = (state) => state.cart.appliedCoupon;

export const selectTotalQuantity = (state) => {
    const items = state.cart?.items;
    if (!items || !Array.isArray(items)) {
        return 0;
    }
    return items.reduce((acc, item) => acc + (item.quantity || 0), 0);
};

export const selectDiscountedPrice = (state) => {
    const totalPrice = Array.isArray(state.cart.items)
        ? state.cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0)
        : 0;
    const appliedCoupon = state.cart.appliedCoupon || null;
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === "PERCENTAGE") {
        return (totalPrice * appliedCoupon.discount) / 100;
    } else if (appliedCoupon.type === "FIXED") {
        return appliedCoupon.discount;
    }
    return 0;
};

export const selectTotalPrice = (state) => {
    const totalPrice = Array.isArray(state.cart.items)
        ? state.cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0)
        : 0;
    const appliedCoupon = state.cart.appliedCoupon || null;
    if (!appliedCoupon) return totalPrice;
    if (appliedCoupon.type === "PERCENTAGE") {
        return totalPrice - (totalPrice * appliedCoupon.discount) / 100;
    } else if (appliedCoupon.type === "FIXED") {
        return Math.max(totalPrice - appliedCoupon.discount, 0);
    }
    return totalPrice;
};
