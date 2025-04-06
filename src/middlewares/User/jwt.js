const jwt = require("jsonwebtoken");
const { failResp } = require("../../utils");
const CustomerAccountModal = require("../../models/User/User");

const SECRET_KEY = process.env.JWT_SECRET || "abc";
const EXPIRATION_TIME = "24h"; // Token expires in 1 hour

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
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

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
    const user = await CustomerAccountModal.findById(decoded.id);

    if (!user || !user.isActive || user.isBlocked) {
      return failResp(
        res,
        403,
        "Account status is not active or is blocked.",
        "ACCESS_BLOCKED",
        {
          isActive: user?.isActive,
          isBlocked: user?.isBlocked,
        }
      );
    }

    req.tokenUserData = user; // Attach user data to request object
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
