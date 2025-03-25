const { failResp, failResponseObject } = require("../../utils");
const rateLimit = require("express-rate-limit");

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
  if (!email || !/.+\@.+\..+/.test(email)) {
    return failResp(res, 400, "Invalid email format", "INVALID_EMAIL");
  }
  if (!password || password.length < 6) {
    return failResp(
      res,
      400,
      "Password must be at least 6 characters long",
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

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 attempts per IP
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
      "Too many login attempts, please try again later.",
      "TOO_MANY_LOGIN_ATTEMPTS",
      respData
    );
  },
});

module.exports = {
  validateRegistration,
  loginLimiter,
};
