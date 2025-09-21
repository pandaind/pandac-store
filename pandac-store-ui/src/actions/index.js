/**
 * Centralized actions for React Router
 * Separates form submission logic from components
 */

import apiClient from '../api/apiClient.js';
import { API_ENDPOINTS } from '../config/index.js';
import { isValidEmail } from '../utils/index.js';

/**
 * Error handler for actions
 * @param {Error} error - The error object
 * @param {string} context - Context description for the error
 * @returns {Object} Action response with error
 */
const handleActionError = (error, context) => {
  console.error(`Action error [${context}]:`, error);
  
  // Handle different response formats from backend
  const responseData = error.response?.data;
  
  // If the response data is directly field errors (like { password: "message" })
  if (responseData && typeof responseData === 'object' && !responseData.errorMessage && !responseData.errors) {
    // Check if response contains field validation errors
    const hasFieldErrors = Object.keys(responseData).some(key => 
      ['name', 'email', 'password', 'mobileNumber', 'username'].includes(key)
    );
    
    if (hasFieldErrors) {
      return {
        success: false,
        error: 'Please fix the validation errors below.',
        errors: responseData
      };
    }
  }
  
  // Standard error handling for structured responses
  const message = responseData?.errorMessage || 
                  error.message || 
                  `Failed to ${context}. Please try again.`;
  
  return {
    success: false,
    error: message,
    errors: responseData?.errors || {}
  };
};

/**
 * Login action
 */
export const loginAction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const loginData = {
      username: formData.get('username'),
      password: formData.get('password'),
    };

    // Basic validation
    if (!loginData.username || !loginData.password) {
      return {
        success: false,
        error: 'Username and password are required',
        errors: {
          username: !loginData.username ? 'Username is required' : '',
          password: !loginData.password ? 'Password is required' : ''
        }
      };
    }

    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, loginData);
    
    return {
      success: true,
      data: response.data,
      token: response.data.jwtToken || response.data.token,
      jwtToken: response.data.jwtToken || response.data.token,
      user: response.data.user,
      message: response.data.message
    };
  } catch (error) {
    return handleActionError(error, 'login');
  }
};

/**
 * Register action
 */
export const registerAction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const registerData = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      mobileNumber: formData.get('mobileNumber'),
    };

    // Basic validation
    const errors = {};
    
    if (!registerData.name?.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!registerData.email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(registerData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!registerData.password) {
      errors.password = 'Password is required';
    } else if (registerData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (registerData.password.length > 50) {
      errors.password = 'Password must be less than 50 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(registerData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)';
    }
    
    if (!registerData.mobileNumber) {
      errors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(registerData.mobileNumber)) {
      errors.mobileNumber = 'Mobile number must be 10 digits';
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        error: 'Please fix the validation errors',
        errors
      };
    }

    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, registerData);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleActionError(error, 'register');
  }
};

/**
 * Contact action
 */
export const contactAction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const contactData = {
      name: formData.get('name'),
      email: formData.get('email'),
      mobileNumber: formData.get('mobileNumber'),
      message: formData.get('message'),
    };

    // Basic validation
    const errors = {};
    
    if (!contactData.name?.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!contactData.email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(contactData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!contactData.mobileNumber?.trim()) {
      errors.mobileNumber = 'Mobile number is required';
    }
    
    if (!contactData.message?.trim()) {
      errors.message = 'Message is required';
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        error: 'Please fix the validation errors',
        errors
      };
    }

    const response = await apiClient.post(API_ENDPOINTS.CONTACT, contactData);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleActionError(error, 'send message');
  }
};

/**
 * Profile action
 */
export const profileAction = async ({ request }) => {
  try {
    const formData = await request.formData();
    
    // Extract flat profile data structure expected by backend
    const profileData = {
      name: formData.get('name'),
      email: formData.get('email'),
      mobileNumber: formData.get('mobileNumber'),
      street: formData.get('street'),
      city: formData.get('city'),
      state: formData.get('state'),
      postalCode: formData.get('postalCode'),
      country: formData.get('country'),
    };

    // Basic validation
    const errors = {};
    
    if (!profileData.name?.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!profileData.email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(profileData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!profileData.mobileNumber) {
      errors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(profileData.mobileNumber)) {
      errors.mobileNumber = 'Mobile number must be 10 digits';
    }

    // Address validation
    if (!profileData.street?.trim()) {
      errors.street = 'Street address is required';
    }
    
    if (!profileData.city?.trim()) {
      errors.city = 'City is required';
    }
    
    if (!profileData.state?.trim()) {
      errors.state = 'State is required';
    }
    
    if (!profileData.postalCode) {
      errors.postalCode = 'Postal code is required';
    } else if (!/^\d{5}$/.test(profileData.postalCode)) {
      errors.postalCode = 'Postal code must be 5 digits';
    }
    
    if (!profileData.country?.trim()) {
      errors.country = 'Country is required';
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        error: 'Please fix the validation errors',
        errors
      };
    }

    const response = await apiClient.put(API_ENDPOINTS.AUTH.PROFILE, profileData);
    
    return {
      success: true,
      profileData: response.data
    };
  } catch (error) {
    return handleActionError(error, 'update profile');
  }
};

/**
 * Logout action
 * Clears authentication state and localStorage
 */
export const logoutAction = async () => {
  try {
    // Clear localStorage
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    
    // Clear any other user-specific data
    sessionStorage.removeItem('redirectPath');
    
    return {
      success: true,
      message: 'Logged out successfully'
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: true, // Still return success since logout should always work
      message: 'Logged out'
    };
  }
};
