/**
 * Application configuration
 * Centralizes all environment variables and app settings
 */

// Environment Variables with Fallbacks
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Pandac Store',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Feature Flags
  ENABLE_ADMIN_FEATURES: import.meta.env.VITE_ENABLE_ADMIN_FEATURES === 'true',
  ENABLE_STRIPE_PAYMENT: import.meta.env.VITE_ENABLE_STRIPE_PAYMENT === 'true',
  ENABLE_DEBUG_MODE: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
  
  // Development
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
};

// Application Constants
export const APP_CONFIG = {
  CART_STORAGE_KEY: 'cart',
  THEME_STORAGE_KEY: 'theme',
  
  PAGINATION: {
    DEFAULT_ITEMS_PER_PAGE: 10,
    MAX_VISIBLE_PAGES: 5,
  },
  
  TOAST: {
    POSITION: 'top-center',
    AUTO_CLOSE: 3000,
    HIDE_PROGRESS_BAR: false,
  },
  
  VALIDATION: {
    POSTAL_CODE_PATTERN: /^\d{5}$/,
    MOBILE_NUMBER_PATTERN: /^[0-9]{10}$/,
    NAME_PATTERN: /^[a-zA-Z\s]+$/,
  },
  
  TIMEOUTS: {
    DEBOUNCE_SEARCH: 300,
    API_REQUEST: 10000,
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/profile',
  },
  PRODUCTS: '/products',
  ORDERS: '/orders',
  ADMIN: {
    ORDERS: '/admin/orders',
    MESSAGES: '/admin/messages',
    USERS: '/customers',
  },
  DISCOUNT: '/discount',
  PAYMENT: {
    CREATE_INTENT: '/payment/create-payment-intent',
  },
  CONTACT: '/contacts',
};

// Validate required environment variables
const requiredEnvVars = ['VITE_STRIPE_PUBLISHABLE_KEY'];

export const validateEnvironment = () => {
  const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    if (ENV.IS_PRODUCTION) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }
};

// Initialize environment validation
if (ENV.IS_PRODUCTION) {
  validateEnvironment();
}
