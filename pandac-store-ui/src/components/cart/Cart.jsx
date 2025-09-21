import React, {useMemo, useState} from "react";
import PageTitle from "../home/PageTitle.jsx";
import {Link, useLoaderData} from "react-router-dom";
import emptyCartImage from "../../assets/util/emptycart.png";
import {useDispatch, useSelector} from "react-redux";
import {addCoupon, removeCoupon, selectAppliedCoupon, selectCartItems} from "../../store/cart-slice.js";
import CartTable from "./CartTable.jsx";
import {selectIsAuthenticated, selectUser} from "../../store/auth-slice.js";

export default function Cart() {
  const cart = useSelector(selectCartItems);
  const appliedCoupon = useSelector(selectAppliedCoupon);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");

  const isAddressIncomplete = useMemo(() => {
    if (!isAuthenticated || !user) return false;
    if (!user.address) return true;
    const { street, city, state, postalCode, country } = user.address;
    return !street || !city || !state || !postalCode || !country;
  }, [isAuthenticated, user]);

  const isCartEmpty = useMemo(() => cart.length === 0, [cart.length]);

  const availableCoupons = useLoaderData();

  const handleApplyCoupon = () => {
    setCouponError("");
    const couponCode = couponInput.toUpperCase();
    if (availableCoupons.length > 0) {
      const coupon = availableCoupons.find(
          (c) => c.code.toUpperCase() === couponCode
      );
      if (coupon) {
        dispatch(addCoupon(coupon));
        setCouponInput("");
      } else {
        setCouponError("Invalid coupon code");
      }
    }
  };

  const handleRemoveCoupon = () => {
    setCouponError("");
    dispatch(removeCoupon());
  };

  // Rest of your component remains the same...
  return (
      <div className="min-h-[852px] py-12 bg-normalbg dark:bg-darkbg font-primary">
        <div className="max-w-4xl mx-auto px-4">
          <PageTitle title="Your Cart" />
          {!isCartEmpty ? (
              <>
                {isAddressIncomplete && (
                    <p className="text-red-500 text-lg mt-2 text-center">
                      Please update your address in your profile to proceed to
                      checkout.
                    </p>
                )}
                <CartTable />

                {/* Coupon Code Section */}
                <div className="mt-6 p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-lighter">
                    Have a coupon code?
                  </h3>

                  {!appliedCoupon ? (
                      <div className="flex gap-3">
                        <input
                            type="text"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            placeholder="Enter coupon code"
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-lighter focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                            onClick={handleApplyCoupon}
                            disabled={!couponInput.trim()}
                            className="px-4 py-2 bg-primary dark:bg-light text-white dark:text-black font-semibold rounded-sm hover:bg-dark dark:hover:bg-lighter transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          Apply
                        </button>
                      </div>
                  ) : (
                      <div className="flex justify-between items-center p-3 bg-green-100 dark:bg-green-800 rounded-sm">
                        <span className="text-green-800 dark:text-green-100 font-medium">
                          Coupon "{appliedCoupon.code}" applied!
                          {appliedCoupon.type === "PERCENTAGE"
                              ? ` ${appliedCoupon.discount}% off`
                              : ` $${appliedCoupon.discount} off`
                          }
                        </span>
                        <button
                            onClick={handleRemoveCoupon}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium">
                          Remove
                        </button>
                      </div>
                  )}

                  {couponError && (
                      <p className="text-red-500 text-sm mt-2">{couponError}</p>
                  )}
                </div>

                <div className="flex justify-between mt-8 space-x-4">
                  <Link
                      to="/home"
                      className="py-2 px-4 bg-primary dark:bg-light text-white dark:text-black text-xl font-semibold rounded-sm flex justify-center items-center hover:bg-dark dark:hover:bg-lighter transition"
                  >
                    Back to Products
                  </Link>
                  <Link
                      to={isAddressIncomplete ? "#" : "/checkout"}
                      className={`py-2 px-4 text-xl font-semibold rounded-sm flex justify-center items-center transition
                  ${
                          isAddressIncomplete
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-primary dark:bg-light hover:bg-dark dark:hover:bg-lighter"
                      } text-white dark:text-black`}
                      onClick={(e) => {
                        if (isAddressIncomplete) {
                          e.preventDefault();
                        }
                      }}
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </>
          ) : (
              <div className="text-center text-gray-600 dark:text-lighter flex flex-col items-center">
                <p className="max-w-[576px] px-2 mx-auto text-base mb-4">
                  Oops... Your cart is empty. Continue shopping
                </p>
                <img
                    src={emptyCartImage}
                    alt="Empty Cart"
                    className="max-w-[300px] mx-auto mb-6 dark:bg-emerald-400 dark:rounded-md"
                />
                <Link
                    to="/home"
                    className="py-2 px-4 bg-primary dark:bg-light text-white dark:text-black text-xl font-semibold rounded-sm flex justify-center items-center hover:bg-dark dark:hover:bg-lighter transition"
                >
                  Back to Products
                </Link>
              </div>
          )}
        </div>
      </div>
  );
}