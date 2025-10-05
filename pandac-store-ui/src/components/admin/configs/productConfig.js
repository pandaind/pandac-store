import apiClient from '../../../api/apiClient.js';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ENV } from '../../../config/index.js';

// Product Management Configuration
export const productConfig = {
    // Basic Information
    title: "Product Administration",
    entityName: "Product",
    entityNamePlural: "Products",
    idField: "productId",

    // Table Columns Configuration
    columns: [
        {
            key: "productId",
            label: "ID",
            type: "text"
        },
        {
            key: "name",
            label: "Name", 
            type: "text"
        },
        {
            key: "price",
            label: "Price",
            type: "currency"
        },
        {
            key: "popularity",
            label: "Popularity",
            type: "text"
        },
        {
            key: "description",
            label: "Description",
            type: "truncate"
        },
        {
            key: "imageUrl",
            label: "Image",
            type: "image",
            fallback: "/plants/002.png"
        }
    ],

    // Form Fields Configuration
    fields: [
        {
            key: "name",
            label: "Product Name",
            type: "text",
            required: true,
            placeholder: "Enter product name"
        },
        {
            key: "price",
            label: "Price",
            type: "number",
            required: true,
            step: "0.01",
            min: "0",
            placeholder: "0.00"
        },
        {
            key: "description",
            label: "Description",
            type: "textarea",
            required: true,
            rows: 3,
            placeholder: "Enter product description"
        },
        {
            key: "popularity",
            label: "Popularity",
            type: "number",
            min: "0",
            defaultValue: "0",
            placeholder: "Enter popularity score"
        },
        {
            key: "imageUrl",
            label: "Product Image",
            type: "file",
            accept: "image/*"
        }
    ],

    // File upload configuration
    fileFields: ["imageUrl"],

    // Actions Configuration
    actions: {
        create: true,
        edit: true,
        delete: true,
        createLabel: "Add New Product",
        editLabel: "Edit",
        deleteLabel: "Delete"
    },

    // Modal Configuration
    modal: {
        createTitle: "Add New Product",
        editTitle: "Edit Product",
        createLabel: "Add Product",
        updateLabel: "Update Product",
        cancelLabel: "Cancel",
        savingLabel: "Saving...",
        uploadingLabel: "Uploading Image..."
    },

    // Pagination Configuration
    pagination: {
        itemsPerPage: 10
    },

    // API Configuration
    api: {
        create: async (data) => {
            try {
                const response = await apiClient.post('/products', data);
                return response.data;
            } catch (error) {
                throw new Error(
                    error.response?.data?.errorMessage ||
                    error.message ||
                    'Failed to create product'
                );
            }
        },
        update: async (id, data) => {
            try {
                const response = await apiClient.put(`/products/${id}`, data);
                return response.data;
            } catch (error) {
                throw new Error(
                    error.response?.data?.errorMessage ||
                    error.message ||
                    'Failed to update product'
                );
            }
        },
        delete: async (id) => {
            try {
                await apiClient.delete(`/products/${id}`);
                return { success: true };
            } catch (error) {
                throw new Error(
                    error.response?.data?.errorMessage ||
                    error.message ||
                    'Failed to delete product'
                );
            }
        },
        uploadFile: async (file, _fieldName) => {
            try {
                // Validate file before upload
                if (!file || !(file instanceof File)) {
                    throw new Error('Invalid file provided for upload');
                }
                
                const formData = new FormData();
                formData.append('imageFile', file, file.name);
                
                // Get JWT token
                const jwtToken = localStorage.getItem("jwtToken");
                
                // Get CSRF token from cookies
                let csrfToken = Cookies.get("XSRF-TOKEN");
                if (!csrfToken) {
                    // Fetch CSRF token if not available
                    await axios.get(`${ENV.API_BASE_URL}/csrf-token`, {
                        withCredentials: true,
                    });
                    csrfToken = Cookies.get("XSRF-TOKEN");
                    if (!csrfToken) {
                        throw new Error("Failed to retrieve CSRF token from cookies");
                    }
                }
                
                // Use raw axios to bypass apiClient interceptors but include CSRF token
                const response = await axios.post(
                    `${ENV.API_BASE_URL}/products/upload-image`,
                    formData,
                    {
                        headers: {
                            ...(jwtToken && { 'Authorization': `Bearer ${jwtToken}` }),
                            'X-XSRF-TOKEN': csrfToken,
                        },
                        withCredentials: true,
                        timeout: 30000,
                    }
                );
                
                // Backend returns plain text URL string, not JSON
                return { url: response.data };
            } catch (error) {
                throw new Error(
                    error.response?.data?.errorMessage ||
                    error.message ||
                    'Failed to upload file'
                );
            }
        }
    },

    // Data Transformers
    transformers: {
        beforeSave: (data) => {
            return {
                ...data,
                price: parseFloat(data.price),
                popularity: parseInt(data.popularity) || 0
            };
        }
    }
};
