import apiClient from '../../../api/apiClient.js';

// Discount/Coupon Management Configuration
export const discountConfig = {
    // Basic Information
    title: "Discount & Coupon Management",
    entityName: "Discount",
    entityNamePlural: "Discounts",
    idField: "code",

    // Table Columns Configuration
    columns: [
        {
            key: "code",
            label: "Coupon Code",
            type: "text"
        },
        {
            key: "type",
            label: "Type",
            type: "badge",
            badgeColors: {
                "PERCENTAGE": "bg-blue-100 text-blue-800",
                "FIXED": "bg-green-100 text-green-800"
            }
        },
        {
            key: "discount",
            label: "Discount Value",
            type: "discount"
        }
    ],

    // Form Fields Configuration
    fields: [
        {
            key: "code",
            label: "Coupon Code",
            type: "text",
            required: true,
            placeholder: "Enter coupon code (e.g., SAVE20)",
            pattern: "^[A-Z0-9]+$",
            title: "Use only uppercase letters and numbers"
        },
        {
            key: "type",
            label: "Discount Type",
            type: "select",
            required: true,
            options: [
                { value: "PERCENTAGE", label: "Percentage (e.g., 20% off)" },
                { value: "FIXED", label: "Fixed Amount (e.g., $10 off)" }
            ]
        },
        {
            key: "discount",
            label: "Discount Value",
            type: "number",
            required: true,
            step: "0.01",
            min: "0",
            placeholder: "Enter discount value"
        }
    ],

    // Actions Configuration
    actions: {
        create: true,
        edit: true,
        delete: true,
        createLabel: "Add New Discount",
        editLabel: "Edit",
        deleteLabel: "Delete"
    },

    // Modal Configuration
    modal: {
        createTitle: "Add New Discount",
        editTitle: "Edit Discount",
        createLabel: "Add Discount",
        updateLabel: "Update Discount",
        cancelLabel: "Cancel",
        savingLabel: "Saving...",
        uploadingLabel: "Processing..."
    },

    // Pagination Configuration
    pagination: {
        itemsPerPage: 15
    },

    // API Configuration
    api: {
        create: async (data) => {
            try {
                const response = await apiClient.post('/discount', data);
                return response.data;
            } catch (error) {
                throw new Error(
                    error.response?.data?.errorMessage ||
                    error.message ||
                    'Failed to create discount'
                );
            }
        },
        update: async (id, data) => {
            try {
                const response = await apiClient.put(`/discount/${id}`, data);
                return response.data;
            } catch (error) {
                throw new Error(
                    error.response?.data?.errorMessage ||
                    error.message ||
                    'Failed to update discount'
                );
            }
        },
        delete: async (id) => {
            try {
                await apiClient.delete(`/discount/${id}`);
                return { success: true };
            } catch (error) {
                throw new Error(
                    error.response?.data?.errorMessage ||
                    error.message ||
                    'Failed to delete discount'
                );
            }
        }
    },

    // Data Transformers
    transformers: {
        beforeSave: (data) => {
            return {
                ...data,
                code: data.code?.toUpperCase(),
                discount: parseFloat(data.discount)
            };
        }
    }
};
