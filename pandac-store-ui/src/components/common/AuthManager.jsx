import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, validateToken, selectJwtToken, selectIsAuthenticated } from '../../store/auth-slice';
import { tokenUtils } from '../../utils/index';

/**
 * AuthManager Component
 * Handles token validation and automatic logout on token expiration
 * This component doesn't render anything - it's just for side effects
 */
const AuthManager = () => {
  const dispatch = useDispatch();
  const jwtToken = useSelector(selectJwtToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    // Set up periodic token validation
    const validateTokenPeriodically = () => {
      if (isAuthenticated && jwtToken) {
        if (tokenUtils.isExpired(jwtToken)) {
          dispatch(logout());
          
          // Clear localStorage
          localStorage.removeItem('jwtToken');
          localStorage.removeItem('user');
          
          // Redirect to login if not already there
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      }
    };

    // Check token every 30 seconds
    const tokenCheckInterval = setInterval(validateTokenPeriodically, 30000);

    // Also check when the page regains focus (user switches back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        validateTokenPeriodically();
      }
    };

    // Listen for page visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      clearInterval(tokenCheckInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dispatch, isAuthenticated, jwtToken]);

  // This component doesn't render anything
  return null;
};

export default AuthManager;
