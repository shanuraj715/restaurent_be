// Define all possible roles in the system
const ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    MANAGER: 'manager'
};

// Define all possible permissions
const PERMISSIONS = {
    CATEGORY: {
        CREATE: 'category:create',
        READ: 'category:read',
        UPDATE: 'category:update',
        DELETE: 'category:delete'
    },
    USER: {
        CREATE: 'user:create',
        READ: 'user:read',
        UPDATE: 'user:update',
        DELETE: 'user:delete'
    },
    ORDER: {
        CREATE: 'order:create',
        READ: 'order:read',
        UPDATE: 'order:update',
        DELETE: 'order:delete'
    },
    SETTINGS: {
        READ: 'settings:read',
        UPDATE: 'settings:update'
    }
};

// Define role-permission mappings
const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: [
        PERMISSIONS.CATEGORY.CREATE,
        PERMISSIONS.CATEGORY.READ,
        PERMISSIONS.CATEGORY.UPDATE,
        PERMISSIONS.CATEGORY.DELETE,
        PERMISSIONS.USER.CREATE,
        PERMISSIONS.USER.READ,
        PERMISSIONS.USER.UPDATE,
        PERMISSIONS.USER.DELETE,
        PERMISSIONS.ORDER.CREATE,
        PERMISSIONS.ORDER.READ,
        PERMISSIONS.ORDER.UPDATE,
        PERMISSIONS.ORDER.DELETE,
        PERMISSIONS.SETTINGS.READ,
        PERMISSIONS.SETTINGS.UPDATE
    ],
    [ROLES.USER]: [
        PERMISSIONS.CATEGORY.READ,
        PERMISSIONS.ORDER.CREATE,
        PERMISSIONS.ORDER.READ,
        PERMISSIONS.ORDER.UPDATE,
        PERMISSIONS.SETTINGS.READ
    ],
    [ROLES.MANAGER]: [
        PERMISSIONS.CATEGORY.CREATE,
        PERMISSIONS.CATEGORY.READ,
        PERMISSIONS.CATEGORY.UPDATE,
        PERMISSIONS.USER.READ,
        PERMISSIONS.ORDER.CREATE,
        PERMISSIONS.ORDER.READ,
        PERMISSIONS.ORDER.UPDATE,
        PERMISSIONS.SETTINGS.READ
    ]
};

// Helper function to check if a role has a specific permission
const hasPermission = (role, permission) => {
    return ROLE_PERMISSIONS[role]?.includes(permission) || false;
};

// Helper function to get all permissions for a role
const getRolePermissions = (role) => {
    return ROLE_PERMISSIONS[role] || [];
};

module.exports = {
    ROLES,
    PERMISSIONS,
    ROLE_PERMISSIONS,
    hasPermission,
    getRolePermissions
}; 