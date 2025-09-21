import React, { useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectIsInitialized } from "../store/auth-slice";
import { FullPageLoading } from "./common/Loading";

export default function ProtectedRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInitialized = useSelector(selectIsInitialized);
  const location = useLocation();

  useEffect(() => {
    const skipRedirect = sessionStorage.getItem("skipRedirectPath") === "true";
    if (!isAuthenticated && location.pathname !== "/login" && !skipRedirect && isInitialized) {
      sessionStorage.setItem("redirectPath", location.pathname);
    }
  }, [isAuthenticated, location.pathname, isInitialized]);

  // Show loading while auth state is being initialized
  if (!isInitialized) {
    return <FullPageLoading message="Checking authentication..." />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
