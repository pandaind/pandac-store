import React, { useState, useEffect } from "react";
import { selectUser } from "../../store/auth-slice.js";
import apiClient from "../../api/apiClient.js";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectTotalPrice,
  clearCart, selectDiscountedPrice, selectAppliedCoupon,
} from "../../store/cart-slice.js";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import PageTitle from "../home/PageTitle.jsx";
import { toast } from "react-toastify";
import { ENV, API_ENDPOINTS } from "../../config/index.js";

export default function CheckoutForm() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const cart = useSelector(selectCartItems);
  const totalPrice = useSelector(selectTotalPrice);
  const discount = useSelector(selectDiscountedPrice);
  const appliedCoupon = useSelector(selectAppliedCoupon);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [elementErrors, setElementErrors] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  // Check if Stripe is properly configured
  useEffect(() => {
    if (!ENV.STRIPE_PUBLISHABLE_KEY) {
      setErrorMessage("Stripe is not properly configured. Please check your environment variables.");
      console.error("Missing VITE_STRIPE_PUBLISHABLE_KEY in environment variables");
    } else if (!ENV.ENABLE_STRIPE_PAYMENT) {
      setErrorMessage("Stripe payments are currently disabled.");
      console.warn("Stripe payments are disabled via feature flag");
    }
  }, []);

  const isDarkMode = localStorage.getItem("theme") === "dark";

  const labelStyle =
    "block text-lg font-semibold text-primary dark:text-light mb-2";
  const fieldBaseClass =
    "w-full px-4 py-2 text-base border rounded-md transition border-primary dark:border-light focus:ring focus:ring-dark dark:focus:ring-lighter focus:outline-none text-gray-800 dark:text-lighter bg-white dark:bg-gray-600 placeholder-gray-400 dark:placeholder-gray-300";
  const fieldErrorClass =
    "border-red-400 dark:border-red-500 focus:ring-red-500";
  const fieldValidClass =
    "border-primary dark:border-light focus:ring-dark dark:focus:ring-lighter";

  const getClassForElement = (field) =>
    `${fieldBaseClass} ${
      elementErrors[field] ? fieldErrorClass : fieldValidClass
    }`;

  const elementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: isDarkMode ? "#E5E7EB" : "#374151",
        backgroundColor: isDarkMode ? "#4B5563" : "#FFFFFF",
      },
      invalid: {
        color: "#F87171",
        backgroundColor: isDarkMode ? "#4B5563" : "#FFFFFF",
      },
    },
  };

  function handleCardChange(field, event) {
    setElementErrors((prev) => ({
      ...prev,
      [field]: event.error ? event.error.message : "",
    }));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage("Stripe.js is not loaded yet. Please wait and try again.");
      console.error("Stripe not loaded - stripe:", !!stripe, "elements:", !!elements);
      return;
    }

    if (Object.values(elementErrors).some((error) => error)) {
      setErrorMessage("Please correct the highlighted errors.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(""); // Clear previous errors

    try {
      console.log("Creating payment intent for amount:", totalPrice * 100);
      
      const response = await apiClient.post(API_ENDPOINTS.PAYMENT.CREATE_INTENT, {
        amount: totalPrice * 100,
        currency: "usd",
      });

      const { clientSecret } = response.data;
      
      if (!clientSecret) {
        throw new Error("No client secret received from server");
      }

      console.log("Payment intent created, confirming card payment...");

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: {
              name: user.name,
              email: user.email,
              phone: user.mobileNumber,
              address: {
                line1: user.street,
                city: user.city,
                state: user.state,
                postal_code: user.postalCode,
                country: user.country,
              },
            },
          },
        }
      );

      if (error) {
        console.error("Payment confirmation error:", error);
        setErrorMessage(error.message || "Payment failed. Please try again.");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("Payment succeeded:", paymentIntent.id);
        toast.success("Payment successful!");
        
        try {
          console.log("Creating order...");
          await apiClient.post(API_ENDPOINTS.ORDERS, {
            totalPrice: totalPrice,
            discount: discount? discount : 0,
            discountCode: appliedCoupon ? appliedCoupon.code : null,
            paymentId: paymentIntent.id,
            paymentStatus: paymentIntent.status,
            items: cart.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          });
          
          console.log("Order created successfully");
          sessionStorage.setItem("skipRedirectPath", "true");
          dispatch(clearCart());
          navigate("/order-success");
        } catch (orderError) {
          console.error("Failed to create order:", orderError);
          setErrorMessage("Order creation failed. Please contact support.");
        }
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      const errorMessage = error.response?.data?.message || error.message || "Error processing payment. Please try again later.";
      setErrorMessage(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-[852px] flex items-center justify-center font-primary dark:bg-darkbg">
      {/* Loading state while Stripe initializes */}
      {!stripe && !errorMessage && (
        <div className="flex flex-col justify-center items-center my-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-light"></div>
          <p className="mt-4 text-xl font-normal text-primary dark:text-light">
            Initializing secure payment...
          </p>
        </div>
      )}

      {/* Processing state */}
      <div
        className={
          isProcessing
            ? "visible  flex flex-col justify-center items-center my-[200px] "
            : "hidden"
        }
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-light"></div>
        <p className="mt-4 text-2xl font-normal text-primary dark:text-light">
          Processing Payment.... Don't refresh the page
        </p>
      </div>

      {/* Main form */}
      <div
        className={
          isProcessing || (!stripe && !errorMessage)
            ? "hidden"
            : "visible bg-white dark:bg-gray-700 shadow-md rounded-lg max-w-md w-full px-8 py-6"
        }
      >
        <PageTitle title="Complete Your Payment" />

        <p className="text-center mt-8 text-lg text-gray-600 dark:text-lighter mb-8">
          Amount to be charged: <strong>${totalPrice.toFixed(2)}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage && (
            <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
              {errorMessage}
            </div>
          )}
          
          {/* Only show form fields if Stripe is loaded and enabled */}
          {stripe && ENV.ENABLE_STRIPE_PAYMENT && (
            <>
              {/* Card Number */}
              <div>
                <label htmlFor="cardNumber" className={labelStyle}>
                  Card Number
                </label>
                <div id="cardNumber" className={getClassForElement("cardNumber")}>
                  <CardNumberElement
                    options={elementOptions}
                    onChange={(event) => handleCardChange("cardNumber", event)}
                  />
                </div>
                {elementErrors.cardNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {elementErrors.cardNumber}
                  </p>
                )}
              </div>

              {/* Card Expiry */}
              <div>
                <label htmlFor="cardExpiry" className={labelStyle}>
                  Expiry Date
                </label>
                <div id="cardExpiry" className={getClassForElement("cardExpiry")}>
                  <CardExpiryElement
                    options={elementOptions}
                    onChange={(event) => handleCardChange("cardExpiry", event)}
                  />
                </div>
                {elementErrors.cardExpiry && (
                  <p className="text-red-500 text-sm mt-1">
                    {elementErrors.cardExpiry}
                  </p>
                )}
              </div>

              {/* Card CVC */}
              <div>
                <label htmlFor="cardCvc" className={labelStyle}>
                  CVC
                </label>
                <div id="cardCvc" className={getClassForElement("cardCvc")}>
                  <CardCvcElement
                    options={elementOptions}
                    onChange={(event) => handleCardChange("cardCvc", event)}
                  />
                </div>
                {elementErrors.cardCvc && (
                  <p className="text-red-500 text-sm mt-1">
                    {elementErrors.cardCvc}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={!stripe || isProcessing || !!errorMessage}
                  className="w-full px-6 py-2 mt-6 text-white dark:text-black text-xl bg-primary dark:bg-light hover:bg-dark dark:hover:bg-lighter rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Payment processing..." : "Pay Now"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
