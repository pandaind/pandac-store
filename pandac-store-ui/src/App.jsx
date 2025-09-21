import React, { Suspense } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import Header from "./components/common/Header.jsx";
import Footer from "./components/common/Footer.jsx";
import { FullPageLoading } from "./components/common/Loading.jsx";
import StripeStatus from "./components/common/StripeStatus.jsx";
import ApiTest from "./components/common/ApiTest.jsx";
import AuthManager from "./components/common/AuthManager.jsx";

/**
 * Main App Component
 * Provides layout structure and handles global loading states
 */
function App() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Auth Manager - handles token validation */}
      <AuthManager />
      
      <Header />
      
      <main className="flex-grow">
        <Suspense fallback={<FullPageLoading message="Loading page..." />}>
          {isLoading ? (
            <FullPageLoading message="Loading..." />
          ) : (
            <Outlet />
          )}
        </Suspense>
      </main>
      
      <Footer />
      
      {/* Debug Status Components */}
      <StripeStatus />
      <ApiTest />
    </div>
  );
}

export default App;
