import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

// Components
import About from "./components/About.jsx";
import Contact from "./components/user/Contact.jsx";
import Login from "./components/user/Login.jsx";
import Cart from "./components/cart/Cart.jsx";
import Home from "./components/home/Home.jsx";
import ErrorPage from "./components/common/ErrorPage.jsx";
import ProductDetail from "./components/product/ProductDetail.jsx";
import CheckoutForm from "./components/cart/CheckoutForm.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Profile from "./components/user/Profile.jsx";
import Orders from "./components/order/Orders.jsx";
import AdminOrders from "./components/admin/AdminOrders.jsx";
import Messages from "./components/admin/Messages.jsx";
import Register from "./components/user/Register.jsx";
import OrderSuccess from "./components/order/OrderSuccess.jsx";
import ProductAdmin from "./components/admin/ProductAdmin.jsx";
import DiscountAdmin from "./components/admin/DiscountAdmin.jsx";
import UserRoleManagement from "./components/admin/UserRoleManagement.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";

// Loaders
import {
  productsLoader,
  contactLoader,
  couponLoader,
  profileLoader,
  ordersLoader,
  adminOrdersLoader,
  messagesLoader,
  usersLoader,
  discountsLoader,
} from "./loaders/index.js";

// Actions
import {
  loginAction,
  registerAction,
  contactAction,
  profileAction,
} from "./actions/index.js";

// External libraries
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Store
import store from "./store/store.js";
import { Provider } from "react-redux";

// Configuration
import { ENV, APP_CONFIG } from "./config/index.js";

// Initialize Stripe
const stripePromise = loadStripe(ENV.STRIPE_PUBLISHABLE_KEY);

// Verify Stripe configuration in development
if (ENV.ENABLE_DEBUG_MODE && ENV.STRIPE_PUBLISHABLE_KEY) {
  console.log('Stripe initialized with key:', ENV.STRIPE_PUBLISHABLE_KEY.substring(0, 20) + '...');
} else if (ENV.ENABLE_DEBUG_MODE) {
  console.warn('Stripe publishable key is missing!');
}

// Route definitions
const routeDefinitions = createRoutesFromElements(
  <Route path="/" element={<App />} errorElement={<ErrorPage />}>
    <Route index element={<Home />} loader={productsLoader} />
    <Route path="/home" element={<Home />} loader={productsLoader} />
    <Route path="/about" element={<About />} />
    <Route
      path="/contact"
      element={<Contact />}
      action={contactAction}
      loader={contactLoader}
    />
    <Route path="/login" element={<Login />} action={loginAction} />
    <Route path="/register" element={<Register />} action={registerAction} />
    <Route path="/cart" element={<Cart />} loader={couponLoader} />
    <Route path="/products/:productId" element={<ProductDetail />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/checkout" element={<CheckoutForm />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route
        path="/profile"
        element={<Profile />}
        loader={profileLoader}
        action={profileAction}
        shouldRevalidate={({ actionResult }) => {
          return !actionResult?.success;
        }}
      />
      <Route path="/orders" element={<Orders />} loader={ordersLoader} />
      <Route
        path="/admin/orders"
        element={<AdminOrders />}
        loader={adminOrdersLoader}
      />
      <Route
        path="/admin/messages"
        element={<Messages />}
        loader={messagesLoader}
      />
      <Route
        path="/admin/products"
        element={<ProductAdmin />}
        loader={productsLoader}
      />
      <Route
        path="/admin/discount"
        element={<DiscountAdmin />}
        loader={discountsLoader}
      />
      <Route
        path="/admin/users"
        element={<UserRoleManagement />}
        loader={usersLoader}
      />
    </Route>
  </Route>
);

// Create router
const appRouter = createBrowserRouter(routeDefinitions);

// Get theme from storage for initial toast theme
const getInitialTheme = () => {
  try {
    return localStorage.getItem(APP_CONFIG.THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

// Render application
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <Elements stripe={stripePromise}>
        <Provider store={store}>
          <RouterProvider router={appRouter} />
        </Provider>
        <ToastContainer
          position={APP_CONFIG.TOAST.POSITION}
          autoClose={APP_CONFIG.TOAST.AUTO_CLOSE}
          hideProgressBar={APP_CONFIG.TOAST.HIDE_PROGRESS_BAR}
          newestOnTop={false}
          draggable
          pauseOnHover
          theme={getInitialTheme()}
          transition={Bounce}
        />
      </Elements>
    </ErrorBoundary>
  </StrictMode>
);
