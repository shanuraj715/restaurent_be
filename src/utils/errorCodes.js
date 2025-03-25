const errorCodes = {
  // Define error codes here
  DB_WRITE_ERROR: "DB_WRITE_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  ACCOUNT_NOT_ACTIVATED: "ACCOUNT_NOT_ACTIVATED",
  ACCOUNT_BLOCKED: "ACCOUNT_BLOCKED",
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
};

module.exports = {
  errorCodes,
  errorData,
};
