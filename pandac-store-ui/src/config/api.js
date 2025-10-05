/**
 * Single source of truth for API configuration
 * Change this ONE place to update all API URLs
 */

// API Base URL - This is the ONLY place to change API endpoint
export const API_BASE_URL = '/api/v1';

// API Timeout
export const API_TIMEOUT = 10000;

// Export for backwards compatibility
export const ENV = {
  API_BASE_URL,
  API_TIMEOUT,
  
  // Other existing configs...
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Pandac Store',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  ENABLE_ADMIN_FEATURES: import.meta.env.VITE_ENABLE_ADMIN_FEATURES === 'true',
  ENABLE_STRIPE_PAYMENT: import.meta.env.VITE_ENABLE_STRIPE_PAYMENT === 'true',
  ENABLE_DEBUG_MODE: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
};