const { failResp } = require("../../../utils");
const rateLimit = require("express-rate-limit");
const validator = require("validator");

// Middleware for validation
const validateRegistration = (req, res, next) => {
  const { name, email, password, mobile, role } = req.body;
  if (!name || name.length < 3 || name.length > 50) {
    return failResp(
      res,
      400,
      "Name must be between 3 and 50 characters",
      "INVALID_NAME"
    );
  }
  if (!email || !validator.isEmail(email)) {
    return failResp(res, 400, "Invalid email format", "INVALID_EMAIL");
  }
  if (!password || password.length < 8) {
    return failResp(
      res,
      400,
      "Password must be at least 8 characters long",
      "INVALID_PASSWORD"
    );
  }
  if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
    return failResp(res, 400, "Invalid mobile number", "INVALID_MOBILE");
  }
  if (role && !["admin", "manager"].includes(role)) {
    return failResp(res, 400, "Invalid role", "INVALID_ROLE");
  }
  next();
};

const loginDataValidator = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !validator.isEmail(email)) {
    return failResp(res, 400, "Invalid email format", "INVALID_EMAIL");
  }
  if (!password || password.length < 8) {
    return failResp(
      res,
      400,
      "Password must be at least 8 characters long",
      "INVALID_PASSWORD"
    );
  }
  next();
};

const rateLimiter = (limit = process.env.LOGIN_LIMIT, ms = 15 * 60 * 1000) => {
  return rateLimit({
    windowMs: ms,
    max: limit, // Max 5 attempts per IP
    legacyHeaders: false,
    standardHeaders: true,

    handler: (req, res, next, options) => {
      const respData = {
        limit: options.max,
        remaining: Math.max(0, options.max - req.rateLimit.remaining),
        retryAfter: options.windowMs,
      };
      return failResp(
        res,
        403,
        "Too many attempts, please try again later.",
        "TOO_MANY_ATTEMPTS",
        respData
      );
    },
  });
};

const loginLimiter = rateLimiter();

const loginCheckLimiter = rateLimiter(200);

module.exports = {
  loginCheckLimiter,
  loginDataValidator,
  loginLimiter,
  validateRegistration,
};
