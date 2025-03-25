const USER_TYPES = ["admin", "manager"];

const USER_TYPES_ID = {
    1: "admin",
    2: "manager",
};

const DEFAULT_USER_ROLE = USER_TYPES_ID[2]; // manager

const MIN_ADMIN_USER_ACCOUNT_PASSWORD_LENGTH = 8;

module.exports = {
    DEFAULT_USER_ROLE,
    MIN_ADMIN_USER_ACCOUNT_PASSWORD_LENGTH,
    USER_TYPES_ID,
    USER_TYPES,
};
