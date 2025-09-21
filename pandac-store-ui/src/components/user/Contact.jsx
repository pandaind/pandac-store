import React, { useEffect, useRef } from "react";
import PageTitle from "../home/PageTitle.jsx";
import { 
  Form,
  useActionData,
  useNavigation,
  useSubmit,
  useLoaderData,
} from "react-router-dom";
import apiClient from "../../api/apiClient.js";
import { toast } from "react-toastify";

export default function Contact() {
  const contactInfo = useLoaderData();
  const actionData = useActionData();
  const formRef = useRef(null);
  const navigation = useNavigation();
  const submit = useSubmit();
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (actionData?.success) {
      formRef.current?.reset();
      toast.success("Your message has been submitted successfully!");
    } else if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const userConfirmed = window.confirm(
      "Are you sure you want to submit the form?"
    );

    if (userConfirmed) {
      const formData = new FormData(formRef.current);
      submit(formData, { method: "post" });
    } else {
      toast.info("Form submission cancelled.");
    }
  };

  const contactMethods = [
    {
      icon: "📞",
      title: "Phone",
      value: contactInfo?.phone,
      color: "text-green-600 dark:text-green-400"
    },
    {
      icon: "✉️",
      title: "Email",
      value: contactInfo?.email,
      color: "text-green-600 dark:text-green-400"
    },
    {
      icon: "📍",
      title: "Address",
      value: contactInfo?.address,
      color: "text-purple-600 dark:text-purple-400"
    }
  ];

  return (
    <div className="max-w-[1152px] min-h-[852px] mx-auto px-6 py-12 font-primary">
      <PageTitle title="Contact Us" />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 mb-12 border border-green-100 dark:border-gray-700">
        <div className="flex items-center justify-center mb-6">
          <div className="text-6xl">💬</div>
        </div>
        <p className="text-lg leading-8 text-center text-gray-700 dark:text-lighter max-w-4xl mx-auto">
          <span className="text-2xl font-bold text-primary dark:text-light block mb-2">
            Get in Touch
          </span>
          We'd love to hear from you! If you have any questions, feedback, or suggestions, please don't hesitate to reach out.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-[1000px] mx-auto">
        {/* Contact Information Cards */}
        <div className="space-y-6">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-primary dark:text-light mb-4">
              Contact Information
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-green-500 mx-auto lg:mx-0 rounded-full"></div>
          </div>

          {contactMethods.map((method, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-600"
            >
              <div className="flex items-center space-x-4">
                <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                  {method.icon}
                </div>
                <div>
                  <h3 className={`text-lg font-semibold mb-1 ${method.color} group-hover:scale-105 transition-transform duration-300`}>
                    {method.title}
                  </h3>
                  <p className="text-gray-600 dark:text-lighter">
                    {method.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary dark:text-light mb-4">
              Send us a Message
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full"></div>
          </div>

          <Form
            method="POST"
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* General Error Display */}
            {actionData?.error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">⚠️</span>
                  <p className="text-red-700 dark:text-red-400 text-sm font-medium">
                    {actionData.error}
                  </p>
                </div>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-lighter mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                className="w-full px-4 py-3 text-base border rounded-lg transition-all duration-300 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none text-gray-800 dark:text-lighter bg-gray-50 dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-300 hover:bg-white dark:hover:bg-gray-600"
                required
                minLength={5}
                maxLength={30}
              />
              {actionData?.errors?.name && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {actionData.errors.name}
                </p>
              )}
            </div>

            {/* Email and Mobile Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-lighter mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 text-base border rounded-lg transition-all duration-300 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none text-gray-800 dark:text-lighter bg-gray-50 dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-300 hover:bg-white dark:hover:bg-gray-600"
                  required
                />
                {actionData?.errors?.email && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {actionData.errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-semibold text-gray-700 dark:text-lighter mb-2">
                  Mobile Number
                </label>
                <input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="tel"
                  required
                  pattern="^\d{10}$"
                  title="Mobile number must be exactly 10 digits"
                  placeholder="1234567890"
                  className="w-full px-4 py-3 text-base border rounded-lg transition-all duration-300 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none text-gray-800 dark:text-lighter bg-gray-50 dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-300 hover:bg-white dark:hover:bg-gray-600"
                />
                {actionData?.errors?.mobileNumber && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {actionData.errors.mobileNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-lighter mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Tell us how we can help you..."
                className="w-full px-4 py-3 text-base border rounded-lg transition-all duration-300 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none text-gray-800 dark:text-lighter bg-gray-50 dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-300 hover:bg-white dark:hover:bg-gray-600 resize-none"
                required
                minLength={5}
                maxLength={500}
              ></textarea>
              {actionData?.errors?.message && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {actionData.errors.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-tl from-green-600 dark:from-green-950 to-emerald-600 dark:to-emerald-900 hover:from-green-700 dark:hover:from-green-800 hover:to-emerald-700 dark:hover:to-emerald-900 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Message...
                  </span>
                ) : (
                  "Send Message"
                )}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}