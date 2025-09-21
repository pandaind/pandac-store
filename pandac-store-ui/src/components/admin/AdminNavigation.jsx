import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminNavigation = () => {
    const location = useLocation();
    
    const navItems = [
        { path: '/admin/products', label: '🛍️ Products', description: 'Manage products and inventory' },
        { path: '/admin/users', label: '👥 Users & Roles', description: 'Manage users and permissions' },
        { path: '/admin/orders', label: '📦 Orders', description: 'View and manage orders' },
        { path: '/admin/discount', label: '🎫 Discounts', description: 'Manage coupons and discounts' },
        { path: '/admin/messages', label: '💬 Messages', description: 'Customer inquiries and support' }
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Admin Panel Navigation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                            location.pathname === item.path
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                        }`}
                    >
                        <div className="text-center">
                            <div className="text-lg font-medium mb-2">{item.label}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {item.description}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AdminNavigation;
