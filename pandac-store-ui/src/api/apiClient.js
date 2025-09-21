import axios from "axios";
import Cookies from "js-cookie";
import { ENV, API_ENDPOINTS } from "../config/index.js";

/**
 * Enhanced API client with better error handling, logging, and retry logic
 */

// Create axios instance with configuration
const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: ENV.API_TIMEOUT,
  withCredentials: true,
});

// Request counter for debugging
let requestCounter = 0;

/**
 * Request interceptor
 * - Adds JWT token to headers
 * - Fetches CSRF token for non-safe methods
 * - Adds request logging in development
 */
apiClient.interceptors.request.use(
  async (config) => {
    const requestId = ++requestCounter;
    config.metadata = { requestId, startTime: Date.now() };

    // Add JWT token if available
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken}`;
    }

    // Only fetch CSRF token for non-safe methods
    const safeMethods = ["GET", "HEAD", "OPTIONS"];
    if (!safeMethods.includes(config.method?.toUpperCase())) {
      try {
        let csrfToken = Cookies.get("XSRF-TOKEN");
        if (!csrfToken) {
          await axios.get(`${ENV.API_BASE_URL}/csrf-token`, {
            withCredentials: true,
          });
          csrfToken = Cookies.get("XSRF-TOKEN");
          if (!csrfToken) {
            throw new Error("Failed to retrieve CSRF token from cookies");
          }
        }
        config.headers["X-XSRF-TOKEN"] = csrfToken;
      } catch (csrfError) {
        console.warn("CSRF token fetch failed:", csrfError.message);
        // Don't fail the request, let the server handle missing CSRF
      }
    }

    // Development logging
    if (ENV.ENABLE_DEBUG_MODE) {
      console.log(`[API Request ${requestId}]`, {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * - Handles authentication errors
 * - Adds response logging
 * - Standardizes error format
 */
apiClient.interceptors.response.use(
  (response) => {
    const { metadata } = response.config;
    const duration = Date.now() - metadata?.startTime;

    // Development logging
    if (ENV.ENABLE_DEBUG_MODE && metadata) {
      console.log(`[API Response ${metadata.requestId}]`, {
        status: response.status,
        duration: `${duration}ms`,
        url: response.config.url,
      });
    }

    return response;
  },
  async (error) => {
    const { metadata } = error.config || {};
    const duration = metadata ? Date.now() - metadata.startTime : 0;

    // Development logging
    if (ENV.ENABLE_DEBUG_MODE && metadata) {
      console.error(`[API Error ${metadata.requestId}]`, {
        status: error.response?.status,
        duration: `${duration}ms`,
        url: error.config?.url,
        message: error.message,
      });
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      const jwtToken = localStorage.getItem("jwtToken");
      if (jwtToken) {
        console.warn('401 Unauthorized - Token may be expired or invalid');
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");
        
        // Only redirect if we're not already on the login page
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          // Use a small delay to allow any pending state updates to complete
          setTimeout(() => {
            window.location.href = "/login";
          }, 100);
        }
      }
    }

    // Enhance error object with standardized format
    const enhancedError = {
      ...error,
      isApiError: true,
      requestId: metadata?.requestId,
      duration,
      status: error.response?.status,
      errorMessage: error.response?.data?.errorMessage || 
                   error.response?.data?.message || 
                   error.message || 
                   'An unexpected error occurred',
    };

    return Promise.reject(enhancedError);
  }
);

/**
 * Create API methods with consistent error handling
 */
export const createApiMethod = (method) => {
  return async (url, data, config = {}) => {
    try {
      const response = await apiClient[method](url, data, config);
      return response.data;
    } catch (error) {
      // Re-throw with consistent format
      throw {
        message: error.errorMessage || error.message,
        status: error.status,
        isApiError: true,
        originalError: error,
      };
    }
  };
};

// Export convenience methods
export const api = {
  get: createApiMethod('get'),
  post: createApiMethod('post'),
  put: createApiMethod('put'),
  patch: createApiMethod('patch'),
  delete: createApiMethod('delete'),
};

export default apiClient;
