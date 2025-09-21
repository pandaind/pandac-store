// Role Management Utilities
export const USER_ROLES = {
    ADMIN: 'ADMIN',
    USER: 'USER', 
    MODERATOR: 'MODERATOR',
    MANAGER: 'MANAGER'
};

export const ROLE_PERMISSIONS = {
    [USER_ROLES.ADMIN]: {
        label: 'Administrator',
        description: 'Full system access with all privileges',
        permissions: [
            'user_management',
            'product_management', 
            'order_management',
            'discount_management',
            'system_configuration',
            'reports_access'
        ],
        color: 'red'
    },
    [USER_ROLES.MANAGER]: {
        label: 'Manager',
        description: 'Business operations and content management',
        permissions: [
            'product_management',
            'order_management', 
            'discount_management',
            'reports_access'
        ],
        color: 'purple'
    },
    [USER_ROLES.MODERATOR]: {
        label: 'Moderator',
        description: 'Content moderation and basic management',
        permissions: [
            'product_management',
            'order_view',
            'content_moderation'
        ],
        color: 'green'
    },
    [USER_ROLES.USER]: {
        label: 'User',
        description: 'Regular customer with basic access',
        permissions: [
            'profile_management',
            'order_history',
            'shopping'
        ],
        color: 'blue'
    }
};

export const getRoleInfo = (role) => {
    return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS[USER_ROLES.USER];
};

export const hasPermission = (userRole, requiredPermission) => {
    const roleInfo = getRoleInfo(userRole);
    return roleInfo.permissions.includes(requiredPermission);
};

export const canAccessAdmin = (userRole) => {
    return [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.MODERATOR].includes(userRole);
};

export const getRoleColor = (role) => {
    const roleInfo = getRoleInfo(role);
    return roleInfo.color;
};

export const validateRoleChange = (currentUserRole, targetUserRole, newRole) => {
    // Admin can change anyone's role
    if (currentUserRole === USER_ROLES.ADMIN) {
        return { allowed: true };
    }
    
    // Manager can promote users to moderator but not admin
    if (currentUserRole === USER_ROLES.MANAGER) {
        if (newRole === USER_ROLES.ADMIN) {
            return { allowed: false, reason: 'Managers cannot assign admin roles' };
        }
        if (targetUserRole === USER_ROLES.ADMIN) {
            return { allowed: false, reason: 'Cannot modify admin users' };
        }
        return { allowed: true };
    }
    
    // Moderators cannot change roles
    return { allowed: false, reason: 'Insufficient permissions to change roles' };
};
