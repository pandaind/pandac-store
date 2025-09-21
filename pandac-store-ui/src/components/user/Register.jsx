import React, { useRef, useEffect } from "react";
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useNavigate,
  useSubmit,
} from "react-router-dom";
import apiClient from "../../api/apiClient.js";
import { toast } from "react-toastify";
import PageTitle from "../home/PageTitle.jsx";

export default function Register() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const submit = useSubmit();

  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (actionData?.success) {
      navigate("/login");
      toast.success("Registration completed successfully. Try login..");
    } else if (actionData?.error || actionData?.errors) {
      toast.error(actionData.error || "Registration failed. Please try again.");
    }
  }, [actionData, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    if (!validatePasswords(formData)) {
      return;
    }
    submit(formData, { method: "post" });
  };

  /**
   * Validate Passwords Match
   */
  const validatePasswords = (formData) => {
    const password = formData.get("password");
    const confirmPwd = formData.get("confirmPwd");

    if (password !== confirmPwd) {
      toast.error("Passwords do not match!");
      return false;
    }
    return true;
  };

  const labelStyle =
    "block text-lg font-semibold text-primary dark:text-light mb-2";
  const textFieldStyle =
    "w-full px-4 py-2 text-base border rounded-md transition border-primary dark:border-light focus:ring focus:ring-dark dark:focus:ring-lighter focus:outline-none text-gray-800 dark:text-lighter bg-white dark:bg-gray-600 placeholder-gray-400 dark:placeholder-gray-300";

  return (
    <div className="min-h-[752px] flex items-center justify-center font-primary dark:bg-darkbg">
      <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg max-w-md w-full px-8 py-6">
        <PageTitle title="Register" />

        <Form
          method="POST"
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Display form errors */}
          {actionData?.error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {actionData.error}
            </div>
          )}
          <div>
            <label htmlFor="name" className={labelStyle}>
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Your Name"
              required
              minLength={5}
              maxLength={30}
              className={textFieldStyle}
            />
            {actionData?.errors?.name && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.errors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className={labelStyle}>
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Your Email"
                autoComplete="email"
                required
                className={textFieldStyle}
              />
              {actionData?.errors?.email && (
                <p className="text-red-500 text-sm mt-1">
                  {actionData.errors.email}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="mobileNumber" className={labelStyle}>
                Mobile Number
              </label>
              <input
                id="mobileNumber"
                type="tel"
                name="mobileNumber"
                placeholder="Your Mobile Number"
                required
                pattern="^\d{10}$"
                title="Mobile number must be exactly 10 digits"
                className={textFieldStyle}
              />
              {actionData?.errors?.mobileNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {actionData.errors.mobileNumber}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="password" className={labelStyle}>
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Your Password (8+ chars with uppercase, lowercase, number, special char)"
              required
              autoComplete="new-password"
              minLength={8}
              maxLength={50}
              className={textFieldStyle}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Password must be 8-50 characters with uppercase, lowercase, number, and special character (@$!%*?&)
            </p>
            {actionData?.errors?.password && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.errors.password}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPwd" className={labelStyle}>
              Confirm Password
            </label>
            <input
              id="confirmPwd"
              type="password"
              name="confirmPwd"
              placeholder="Confirm Your Password"
              required
              autoComplete="confirm-password"
              minLength={8}
              maxLength={50}
              className={textFieldStyle}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-2 text-white dark:text-black text-xl bg-primary dark:bg-light hover:bg-dark dark:hover:bg-lighter rounded-md transition duration-200"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </Form>

        {/* Login Link */}
        <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary dark:text-light hover:text-dark dark:hover:text-primary transition duration-200"
          >
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
}
