import apiClient from '../../../api/apiClient.js';

// Order Management Configuration
export const orderConfig = {
    title: "Order Management", 
    entityName: "Order",
    entityNamePlural: "Orders",
    idField: "orderId",

    columns: [
        { key: "orderId", label: "Order ID", type: "text" },
        { key: "customerName", label: "Customer", type: "text" },
        { key: "total", label: "Total", type: "currency" },
        { key: "status", label: "Status", type: "text" },
        { key: "orderDate", label: "Date", type: "date" }
    ],

    fields: [
        { key: "customerName", label: "Customer Name", type: "text", required: true },
        { key: "total", label: "Total Amount", type: "number", step: "0.01", required: true },
        { key: "status", label: "Status", type: "select", required: true, options: [
            { value: "pending", label: "Pending" },
            { value: "processing", label: "Processing" },
            { value: "shipped", label: "Shipped" },
            { value: "delivered", label: "Delivered" },
            { value: "cancelled", label: "Cancelled" }
        ]},
        { key: "orderDate", label: "Order Date", type: "date", required: true },
        { key: "notes", label: "Notes", type: "textarea", rows: 2 }
    ],

    actions: {
        create: true,
        edit: true,
        delete: false // Don't allow order deletion
    },

    pagination: {
        itemsPerPage: 10
    },

    // API Configuration
    api: {
        create: async (data) => {
            try {
                const response = await apiClient.post('/orders', data);
                return response.data;
            } catch (error) {
                throw new Error(
                    error.response?.data?.errorMessage ||
                    error.message ||
                    'Failed to create order'
                );
            }
        },
        update: async (id, data) => {
            try {
                const response = await apiClient.put(`/orders/${id}`, data);
                return response.data;
            } catch (error) {
                throw new Error(
                    error.response?.data?.errorMessage ||
                    error.message ||
                    'Failed to update order'
                );
            }
        },
        delete: async (id) => {
            try {
                await apiClient.delete(`/orders/${id}`);
                return { success: true };
            } catch (error) {
                throw new Error(
                    error.response?.data?.errorMessage ||
                    error.message ||
                    'Failed to delete order'
                );
            }
        }
    },

    // Data Transformers
    transformers: {
        beforeSave: (data) => {
            return {
                ...data,
                total: parseFloat(data.total),
                orderDate: new Date(data.orderDate).toISOString()
            };
        }
    }
};
