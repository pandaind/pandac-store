import apiClient from '../../../api/apiClient.js';

// User Management Configuration
export const userConfig = {
    title: "User & Role Management",
    entityName: "User",
    entityNamePlural: "Users",
    idField: "userId",

    columns: [
        { key: "userId", label: "User ID", type: "text" },
        { key: "name", label: "Name", type: "text" },
        { key: "email", label: "Email", type: "text" },
        { key: "mobileNumber", label: "Mobile", type: "text" },
        { 
            key: "roles", 
            label: "Roles", 
            type: "badge",
            badgeColors: {
                "ADMIN": "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
                "USER": "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
                "MODERATOR": "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
                "MANAGER": "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100"
            }
        }
    ],

    fields: [
        { 
            key: "name", 
            label: "Full Name", 
            type: "text", 
            required: true,
            minLength: 2,
            maxLength: 50,
            placeholder: "Enter full name",
            pattern: "^[a-zA-Z\\s]+$",
            title: "Name should only contain letters and spaces"
        },
        { 
            key: "email", 
            label: "Email Address", 
            type: "email", 
            required: true,
            placeholder: "Enter email address (e.g., user@example.com)"
        },
        { 
            key: "mobileNumber", 
            label: "Mobile Number", 
            type: "tel", 
            required: true,
            pattern: "^[0-9]{10}$",
            title: "Mobile number must be exactly 10 digits",
            placeholder: "Enter 10-digit mobile number (e.g., 9876543210)"
        },
        { 
            key: "roles", 
            label: "User Role", 
            type: "select", 
            required: true, 
            options: [
                { value: "USER", label: "👤 User - Regular Customer" },
                { value: "MODERATOR", label: "🛡️ Moderator - Content Management" },
                { value: "MANAGER", label: "📊 Manager - Business Operations" },
                { value: "ADMIN", label: "⚡ Admin - Full Access" }
            ]
        }
    ],

    actions: {
        create: true,
        edit: true,
        delete: true,
        createLabel: "Add New User",
        editLabel: "Edit User",
        deleteLabel: "Delete User"
    },

    modal: {
        createTitle: "Add New User",
        editTitle: "Edit User Details",
        createLabel: "Create User",
        updateLabel: "Update User",
        cancelLabel: "Cancel",
        savingLabel: "Saving...",
        uploadingLabel: "Processing..."
    },

    pagination: {
        itemsPerPage: 15
    },

    // API Configuration
    api: {
        create: async (data) => {
            try {
                const response = await apiClient.post('/admin/users', data);
                return response.data;
            } catch (error) {
                throw new Error(
                    error.response?.data?.errorMessage ||
                    error.message ||
                    'Failed to create user'
                );
            }
        },
        update: async (id, data) => {
            try {
                const response = await apiClient.put(`/admin/users/${id}`, data);
                return response.data;
            } catch (error) {
                throw new Error(
                    error.response?.data?.errorMessage ||
                    error.message ||
                    'Failed to update user'
                );
            }
        },
        delete: async (id) => {
            try {
                await apiClient.delete(`/admin/users/${id}`);
                return { success: true };
            } catch (error) {
                throw new Error(
                    error.response?.data?.errorMessage ||
                    error.message ||
                    'Failed to delete user'
                );
            }
        }
    },

    // Data Transformers
    transformers: {
        beforeSave: (data) => {
            return {
                ...data,
                name: data.name?.trim(),
                email: data.email?.toLowerCase().trim(),
                mobileNumber: data.mobileNumber?.replace(/\D/g, '') // Remove non-digits
            };
        }
    }
};
