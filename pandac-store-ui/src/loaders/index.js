/**
 * Centralized loaders for React Router
 * Separates data loading logic from components for better maintainability
 */

import apiClient from '../api/apiClient.js';
import { API_ENDPOINTS } from '../config/index.js';

/**
 * Error handler for loaders
 * @param {Error} error - The error object
 * @param {string} context - Context description for the error
 * @returns {Response} Router error response
 */
const handleLoaderError = (error, context) => {
  const status = error.response?.status || error.status || 500;
  const message = error.response?.data?.errorMessage || 
                  error.message || 
                  `Failed to ${context}. Please try again.`;
  
  console.error(`Loader error [${context}]:`, error);
  
  throw new Response(message, { status });
};

/**
 * Products loader
 */
export const productsLoader = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS);
    return response.data;
  } catch (error) {
    handleLoaderError(error, 'fetch products');
  }
};

/**
 * Contact loader - Contact page doesn't need external data
 */
export const contactLoader = () => {
  // Return empty object as contact page doesn't require external data
  return {};
};

/**
 * Coupon loader
 */
export const couponLoader = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.DISCOUNT);
    return response.data;
  } catch (error) {
    handleLoaderError(error, 'fetch coupons');
  }
};

/**
 * Profile loader
 */
export const profileLoader = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  } catch (error) {
    handleLoaderError(error, 'fetch profile');
  }
};

/**
 * Orders loader (user orders)
 */
export const ordersLoader = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.ORDERS);
    return response.data;
  } catch (error) {
    handleLoaderError(error, 'fetch orders');
  }
};

/**
 * Admin orders loader
 */
export const adminOrdersLoader = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.ORDERS);
    return response.data;
  } catch (error) {
    handleLoaderError(error, 'fetch admin orders');
  }
};

/**
 * Messages loader (admin)
 */
export const messagesLoader = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.MESSAGES);
    return response.data;
  } catch (error) {
    handleLoaderError(error, 'fetch messages');
  }
};

/**
 * Users loader (admin)
 */
export const usersLoader = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.USERS);
    return response.data;
  } catch (error) {
    handleLoaderError(error, 'fetch users');
  }
};

/**
 * Discounts loader (admin)
 */
export const discountsLoader = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.DISCOUNT);
    return response.data;
  } catch (error) {
    handleLoaderError(error, 'fetch discounts');
  }
};
