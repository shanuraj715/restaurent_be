const errorCodes = {
  // Define error codes here
  DB_WRITE_ERROR: "DB_WRITE_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  ACCOUNT_NOT_ACTIVATED: "ACCOUNT_NOT_ACTIVATED",
  ACCOUNT_BLOCKED: "ACCOUNT_BLOCKED",
  INVALID_OR_EXPIRED_TOKEN: "INVALID_OR_EXPIRED_TOKEN",
  CATEGORY_ALREADY_EXISTS: "CATEGORY_ALREADY_EXISTS",
  INVALID_INPUT: "INVALID_INPUT",
  ACCESS_DENIED: "ACCESS_DENIED",
  CATEGORY_NOT_FOUND: "CATEGORY_NOT_FOUND",
  DB_DELETE_ERROR: "DB_DELETE_ERROR",
  // Add more error codes as needed
};

const errorData = {
  [errorCodes["DB_WRITE_ERROR"]]: {
    code: "DBWE",
    message: "Internal Server Error",
    status: 500,
  },
  [errorCodes["SERVER_ERROR"]]: {
    code: "SERVER_ERROR",
    message: "Internal Server Error",
    status: 500,
  },
  [errorCodes["USER_ALREADY_EXISTS"]]: {
    code: "USER_ALREADY_EXISTS",
    message: "Email or Mobile already exists",
    status: 409,
  },
  [errorCodes["INVALID_CREDENTIALS"]]: {
    code: "INVALID_CREDENTIALS",
    message: "Invalid credentials",
    status: 401,
  },
  [errorCodes["ACCOUNT_NOT_ACTIVATED"]]: {
    code: "ACCOUNT_NOT_ACTIVATED",
    message: "Account not activated",
    status: 403,
  },
  [errorCodes["ACCOUNT_BLOCKED"]]: {
    code: "ACCOUNT_BLOCKED",
    message: "Account blocked. Please contact the support person.",
    status: 403,
  },
  [errorCodes["INVALID_OR_EXPIRED_TOKEN"]]: {
    code: "INVALID_OR_EXPIRED_TOKEN",
    message: "Invalid or expired token",
    status: 401,
  },
  [errorCodes["CATEGORY_ALREADY_EXISTS"]]: {
    code: "CATEGORY_ALREADY_EXISTS",
    message: "Category already exists",
    status: 409,
  },
  [errorCodes["INVALID_INPUT"]]: {
    code: "INVALID_INPUT",
    message: "Invalid input",
    status: 400,
  },
  [errorCodes["ACCESS_DENIED"]]: {
    code: "ACCESS_DENIED",
    message: "You are not allowed to access this resource",
    status: 403,
  },
  [errorCodes["CATEGORY_NOT_FOUND"]]: {
    code: "CATEGORY_NOT_FOUND",
    message: "Category not found",
    status: 404,
  },
  [errorCodes["DB_DELETE_ERROR"]]: {
    code: "DB_DELETE_ERROR",
    message: "Error deleting from database",
    status: 500,
  },
};

module.exports = {
  errorCodes,
  errorData,
};
