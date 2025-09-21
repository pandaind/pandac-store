import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { debounce, throttle } from '../utils/index.js';

/**
 * Custom hooks for performance optimization
 */

/**
 * Debounced value hook
 * @param {*} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {*} Debounced value
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Debounced callback hook
 * @param {Function} callback - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @param {Array} deps - Dependencies array
 * @returns {Function} Debounced callback
 */
export const useDebounceCallback = (callback, delay, deps = []) => {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    debounce((...args) => callbackRef.current(...args), delay),
    deps
  );
};

/**
 * Throttled callback hook
 * @param {Function} callback - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @param {Array} deps - Dependencies array
 * @returns {Function} Throttled callback
 */
export const useThrottleCallback = (callback, limit, deps = []) => {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    throttle((...args) => callbackRef.current(...args), limit),
    deps
  );
};

/**
 * Previous value hook
 * @param {*} value - Current value
 * @returns {*} Previous value
 */
export const usePrevious = (value) => {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
};

/**
 * Mount status hook
 * @returns {Object} Mount status
 */
export const useIsMounted = () => {
  const isMounted = useRef(false);
  
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  return isMounted;
};

/**
 * Safe async function hook
 * Prevents state updates on unmounted components
 * @param {Function} asyncFunction - Async function to execute
 * @returns {Function} Safe async function
 */
export const useSafeAsync = (asyncFunction) => {
  const isMounted = useIsMounted();
  
  return useCallback(async (...args) => {
    if (isMounted.current) {
      return await asyncFunction(...args);
    }
  }, [asyncFunction, isMounted]);
};

/**
 * Local storage hook with error handling
 * @param {string} key - Storage key
 * @param {*} initialValue - Initial value
 * @returns {Array} [value, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

/**
 * Intersection Observer hook for lazy loading
 * @param {Object} options - Intersection Observer options
 * @returns {Array} [ref, isIntersecting, entry]
 */
export const useIntersectionObserver = (options = {}) => {
  const [entry, setEntry] = useState();
  const [node, setNode] = useState();

  const observer = useMemo(() => {
    if (typeof window !== 'undefined' && window.IntersectionObserver) {
      return new IntersectionObserver(([entry]) => setEntry(entry), options);
    }
    return null;
  }, [options]);

  useEffect(() => {
    if (!observer || !node) return;
    
    observer.observe(node);
    
    return () => observer.disconnect();
  }, [observer, node]);

  return [setNode, !!entry?.isIntersecting, entry];
};

/**
 * Window size hook
 * @returns {Object} Window size object
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = throttle(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 100);

    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

/**
 * Media query hook
 * @param {string} query - Media query string
 * @returns {boolean} Match status
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};

/**
 * Click outside hook
 * @param {Function} callback - Callback to execute on outside click
 * @returns {React.RefObject} Ref to attach to element
 */
export const useClickOutside = (callback) => {
  const ref = useRef();

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [callback]);

  return ref;
};

/**
 * Keyboard shortcut hook
 * @param {string} key - Key combination (e.g., 'ctrl+s')
 * @param {Function} callback - Callback to execute
 * @param {Array} deps - Dependencies array
 */
export const useKeyboardShortcut = (key, callback, deps = []) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const keys = key.toLowerCase().split('+');
      const hasCtrl = keys.includes('ctrl') && event.ctrlKey;
      const hasAlt = keys.includes('alt') && event.altKey;
      const hasShift = keys.includes('shift') && event.shiftKey;
      const keyPressed = event.key.toLowerCase();
      const mainKey = keys[keys.length - 1];

      if (keyPressed === mainKey && 
          (!keys.includes('ctrl') || hasCtrl) &&
          (!keys.includes('alt') || hasAlt) &&
          (!keys.includes('shift') || hasShift)) {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, deps);
};

/**
 * Form validation hook
 * @param {Object} validationRules - Validation rules object
 * @returns {Object} Validation utilities
 */
export const useFormValidation = (validationRules) => {
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const validate = useCallback((values) => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach(field => {
      const rules = validationRules[field];
      const value = values[field];
      
      if (rules.required && (!value || value.toString().trim() === '')) {
        newErrors[field] = `${field} is required`;
        return;
      }
      
      if (rules.minLength && value && value.length < rules.minLength) {
        newErrors[field] = `${field} must be at least ${rules.minLength} characters`;
        return;
      }
      
      if (rules.pattern && value && !rules.pattern.test(value)) {
        newErrors[field] = rules.message || `${field} format is invalid`;
        return;
      }
      
      if (rules.custom && value) {
        const customError = rules.custom(value);
        if (customError) {
          newErrors[field] = customError;
          return;
        }
      }
    });
    
    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
    
    return newErrors;
  }, [validationRules]);

  const getFieldError = useCallback((field) => errors[field], [errors]);
  
  const clearErrors = useCallback(() => {
    setErrors({});
    setIsValid(false);
  }, []);

  return {
    validate,
    errors,
    isValid,
    getFieldError,
    clearErrors,
  };
};
