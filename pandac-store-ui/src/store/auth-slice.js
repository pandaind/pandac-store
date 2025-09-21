import { createSlice } from "@reduxjs/toolkit";
import { tokenUtils } from "../utils/index.js";

// Function to safely initialize auth state
const initializeAuthState = () => {
  try {
    const jwtToken = localStorage.getItem("jwtToken");
    const user = localStorage.getItem("user");

    // If no token, return unauthenticated state
    if (!jwtToken) {
      return {
        jwtToken: null,
        user: null,
        isAuthenticated: false,
        isInitialized: true,
      };
    }

    // If no user data, return unauthenticated state
    if (!user) {
      return {
        jwtToken: null,
        user: null,
        isAuthenticated: false,
        isInitialized: true,
      };
    }

    // Validate token expiration
    let isTokenValid = false;
    try {
      isTokenValid = !tokenUtils.isExpired(jwtToken);
    } catch (error) {
      isTokenValid = false;
    }

    // If token is invalid/expired, clean up and return unauthenticated
    if (!isTokenValid) {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("user");
      return {
        jwtToken: null,
        user: null,
        isAuthenticated: false,
        isInitialized: true,
      };
    }

    // Parse user data
    let parsedUser = null;
    try {
      parsedUser = JSON.parse(user);
    } catch (error) {
      // Use fallback user data if parsing fails
      parsedUser = { name: 'Unknown User', id: null };
    }

    // All checks passed, return authenticated state
    return {
      jwtToken: jwtToken,
      user: parsedUser,
      isAuthenticated: true,
      isInitialized: true,
    };

  } catch (error) {
    // On any error, return safe unauthenticated state
    return {
      jwtToken: null,
      user: null,
      isAuthenticated: false,
      isInitialized: true,
    };
  }
};

const initialAuthState = initializeAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    loginSuccess(state, action) {
      const { jwtToken, user } = action.payload;
      state.jwtToken = jwtToken;
      state.user = user;
      state.isAuthenticated = true;
      state.isInitialized = true;
    },
    logout(state) {
      state.jwtToken = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
    },
    validateToken(state) {
      if (state.jwtToken && tokenUtils.isExpired(state.jwtToken)) {
        state.jwtToken = null;
        state.user = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
      }
    },
  },
});

export const { loginSuccess, logout, validateToken } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectJwtToken = (state) => state.auth.jwtToken;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsInitialized = (state) => state.auth.isInitialized;
