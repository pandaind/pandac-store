import apiClient from '../../api/apiClient.js';

// Products Loader (reusing existing)
export async function productsLoader() {
  try {
    const response = await apiClient.get("/products");
    return response.data;
  } catch (error) {
    throw new Response(
      error.response?.data?.errorMessage ||
        error.message ||
        "Failed to fetch products. Please try again.",
      { status: error.status || 500 }
    );
  }
}

// Users Loader  
export async function usersLoader() {
  try {
    const response = await apiClient.get("/admin/users");
    return response.data;
  } catch (error) {
    throw new Response(
      error.response?.data?.errorMessage ||
        error.message ||
        "Failed to fetch users. Please try again.",
      { status: error.status || 500 }
    );
  }
}

// Orders Loader
export async function ordersLoader() {
  try {
    const response = await apiClient.get("/orders");
    return response.data;
  } catch (error) {
    throw new Response(
      error.response?.data?.errorMessage ||
        error.message ||
        "Failed to fetch orders. Please try again.",
      { status: error.status || 500 }
    );
  }
}

// Discounts Loader
export async function discountsLoader() {
  try {
    const response = await apiClient.get("/discount");
    return response.data;
  } catch (error) {
    throw new Response(
      error.response?.data?.errorMessage ||
        error.message ||
        "Failed to fetch discounts. Please try again.",
      { status: error.status || 500 }
    );
  }
}
