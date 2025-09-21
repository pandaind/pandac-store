import React, { useEffect } from "react";
import PageTitle from "../home/PageTitle.jsx";
import {
  Link,
  Form,
  useActionData,
  useNavigation,
  useNavigate,
} from "react-router-dom";
import apiClient from "../../api/apiClient.js";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/auth-slice.js";

export default function Login() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const from = sessionStorage.getItem("redirectPath") || "/home";

  useEffect(() => {
    if (actionData?.success) {
      dispatch(
        loginSuccess({ jwtToken: actionData.jwtToken || actionData.token, user: actionData.user })
      );
      sessionStorage.removeItem("redirectPath");
      setTimeout(() => {
        navigate(from);
      }, 100);
    } else if (actionData?.error || actionData?.errors) {
      toast.error(actionData.error || actionData.errors?.message || "Login failed.");
    }
  }, [actionData, dispatch, navigate, from]);

  const labelStyle =
    "block text-lg font-semibold text-primary dark:text-light mb-2";
  const textFieldStyle =
    "w-full px-4 py-2 text-base border rounded-md transition border-primary dark:border-light focus:ring focus:ring-dark dark:focus:ring-lighter focus:outline-none text-gray-800 dark:text-lighter bg-white dark:bg-gray-600 placeholder-gray-400 dark:placeholder-gray-300";
  return (
    <div className="min-h-[852px] flex items-center justify-center font-primary dark:bg-darkbg">
      <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg max-w-md w-full px-8 py-6">
        {/* Title */}
        <PageTitle title="Login" />
        {/* Form */}
        <Form method="POST" className="space-y-6">
          {/* Display form errors */}
          {actionData?.error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {actionData.error}
            </div>
          )}
          
          {/* Username Field */}
          <div>
            <label htmlFor="username" className={labelStyle}>
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Your Username"
              autoComplete="username"
              required
              className={`${textFieldStyle} ${actionData?.errors?.username ? 'border-red-500' : ''}`}
            />
            {actionData?.errors?.username && (
              <p className="text-red-600 text-sm mt-1">{actionData.errors.username}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className={labelStyle}>
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Your Password"
              autoComplete="current-password"
              required
              minLength={4}
              maxLength={20}
              className={`${textFieldStyle} ${actionData?.errors?.password ? 'border-red-500' : ''}`}
            />
            {actionData?.errors?.password && (
              <p className="text-red-600 text-sm mt-1">{actionData.errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-2 text-white dark:text-black text-xl rounded-md transition duration-200 bg-primary dark:bg-light hover:bg-dark dark:hover:bg-lighter"
            >
              {isSubmitting ? "Authenticating..." : "Login"}
            </button>
          </div>
        </Form>

        {/* Register Link */}
        <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary dark:text-light hover:text-dark dark:hover:text-primary transition duration-200"
          >
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}
