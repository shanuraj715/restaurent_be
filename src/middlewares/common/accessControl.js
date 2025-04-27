const { failResp } = require("../../utils/index");
const { errorData } = require("../../utils/errorCodes");
const { hasPermission, PERMISSIONS } = require("../../config/rbac");

/**
 * Middleware to check if user has required permission
 * @param {string} permission - The permission to check
 * @returns {Function} - Express middleware function
 */
const checkPermission = (permission) => {
    return (req, res, next) => {
        const userRole = req.tokenUserData?.role ?? "user";

        if (!hasPermission(userRole, permission)) {
            const errData = errorData["ACCESS_DENIED"];
            return failResp(res, errData.status, errData.message, errData.code);
        }

        next();
    };
};

/**
 * Middleware to check if user has any of the required permissions
 * @param {string[]} permissions - Array of permissions to check
 * @returns {Function} - Express middleware function
 */
const checkAnyPermission = (permissions) => {
    return (req, res, next) => {
        const userRole = req.tokenUserData?.role ?? "user";

        const hasAnyPermission = permissions.some(permission => 
            hasPermission(userRole, permission)
        );

        if (!hasAnyPermission) {
            const errData = errorData["ACCESS_DENIED"];
            return failResp(res, errData.status, errData.message, errData.code);
        }

        next();
    };
};

/**
 * Middleware to check if user has all of the required permissions
 * @param {string[]} permissions - Array of permissions to check
 * @returns {Function} - Express middleware function
 */
const checkAllPermissions = (permissions) => {
    return (req, res, next) => {
        const userRole = req.tokenUserData?.role ?? "user";

        const hasAllPermissions = permissions.every(permission => 
            hasPermission(userRole, permission)
        );

        if (!hasAllPermissions) {
            const errData = errorData["ACCESS_DENIED"];
            return failResp(res, errData.status, errData.message, errData.code);
        }

        next();
    };
};

module.exports = {
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    PERMISSIONS
}; 