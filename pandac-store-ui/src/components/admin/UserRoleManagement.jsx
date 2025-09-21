import React, { useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';
import DataManager from '../common/DataManager';
import { userConfig } from './configs/userConfig';
import { USER_ROLES, ROLE_PERMISSIONS, getRoleInfo } from './roleUtils';
import AdminNavigation from './AdminNavigation';

const UserRoleManagement = () => {
    const users = useLoaderData() || [];
    
    // Calculate role statistics with proper dependency
    const roleStats = useMemo(() => {
        if (!users || !Array.isArray(users)) {
            return {};
        }
        
        const stats = {};
        Object.keys(USER_ROLES).forEach(role => {
            stats[role] = {
                count: users.filter(user => user.roles === role).length,
                ...getRoleInfo(role)
            };
        });
        return stats;
    }, [users]);

    const totalUsers = users.length;

    return (
        <div className="user-role-management p-5 max-w-7xl mx-auto bg-normalbg dark:bg-darkbg min-h-screen transition-colors duration-300">
            {/* Admin Navigation */}
            <AdminNavigation />

            {/* Role Statistics Dashboard */}
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                    User & Role Statistics
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Total Users</p>
                                <p className="text-3xl font-bold">{totalUsers}</p>
                            </div>
                            <div className="bg-blue-400 bg-opacity-30 rounded-full p-3">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {Object.entries(roleStats).map(([role, stats]) => (
                        <div key={role} className={`bg-gradient-to-r from-${stats.color}-500 to-${stats.color}-600 rounded-lg p-4 text-white`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-${stats.color}-100 text-sm font-medium`}>{stats.label}s</p>
                                    <p className="text-3xl font-bold">{stats.count}</p>
                                    <p className={`text-${stats.color}-100 text-xs`}>
                                        {totalUsers > 0 ? Math.round((stats.count / totalUsers) * 100) : 0}% of total
                                    </p>
                                </div>
                                <div className={`bg-${stats.color}-400 bg-opacity-30 rounded-full p-3`}>
                                    <RoleIcon role={role} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Role Permissions Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                            Role Hierarchy
                        </h3>
                        <div className="space-y-2">
                            {Object.entries(ROLE_PERMISSIONS).map(([role, info]) => (
                                <div key={role} className="flex items-center space-x-3">
                                    <div className={`w-3 h-3 rounded-full bg-${info.color}-500`}></div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">{info.label}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        ({roleStats[role]?.count || 0} users)
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                            Recent Activity
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <p>• Total active users: {totalUsers}</p>
                            <p>• Admin users: {roleStats[USER_ROLES.ADMIN]?.count || 0}</p>
                            <p>• Regular customers: {roleStats[USER_ROLES.USER]?.count || 0}</p>
                            <p>• Staff members: {(roleStats[USER_ROLES.MANAGER]?.count || 0) + (roleStats[USER_ROLES.MODERATOR]?.count || 0)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Management Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <DataManager config={userConfig} />
            </div>
        </div>
    );
};

// Role Icon Component
const RoleIcon = ({ role }) => {
    const iconClass = "w-6 h-6";
    
    switch (role) {
        case USER_ROLES.ADMIN:
            return (
                <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            );
        case USER_ROLES.MANAGER:
            return (
                <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            );
        case USER_ROLES.MODERATOR:
            return (
                <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        default:
            return (
                <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zM8 6a2 2 0 114 0v1H8V6z" clipRule="evenodd" />
                </svg>
            );
    }
};

export default UserRoleManagement;
