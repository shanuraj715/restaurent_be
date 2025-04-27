const jwt = require("jsonwebtoken");
const { failResp } = require("../utils");
const AdminUser = require("../models/Admin/AdminUser");
const CustomerAccountModal = require("../models/User/User");

const SECRET_KEY = process.env.JWT_SECRET || "abc";
const EXPIRATION_TIME = "24h"; // Token expires in 24 hours

// Function to generate a JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role ?? "customer",
      name: user.name,
    },
    SECRET_KEY,
    {
      expiresIn: EXPIRATION_TIME,
    }
  );
};

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  const token = (req.headers.cookie?.split('=')?.[1] ?? req.headers.authorization)?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return failResp(
      res,
      401,
      "Access denied. No token provided.",
      "TOKEN_MISSING"
    );
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // Determine which model to use based on the role
    let user;
    if (decoded.role === "admin" || decoded.role === "manager") {
      user = await AdminUser.findById(decoded.id);
    } else {
      user = await CustomerAccountModal.findById(decoded.id);
    }

    if (!user || !user.isActive || user.isBlocked) {
      return failResp(
        res,
        403,
        "Access denied. Invalid token or account status.",
        "INVALID_TOKEN",
        {
          isActive: user?.isActive,
          isBlocked: user?.isBlocked,
        }
      );
    }

    req.tokenUserData = user; // Attach user data to request object
    if (!req.body.token) {
      req.body.token = token;
    }
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return failResp(
        res,
        403,
        "Token expired. Please login again.",
        "TOKEN_EXPIRED",
        { expiredAt: error.expiredAt }
      );
    } else {
      return failResp(res, 403, "Invalid token.", "INVALID_TOKEN");
    }
  }
};

module.exports = { generateToken, verifyToken }; 