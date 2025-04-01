const AdminUser = require("../../models/AdminUser");
const LoginLog = require("../../models/logs/login");
const { failResp, verifyPassword, successResp } = require("../../utils");
const { errorData } = require("../../utils/errorCodes");
const { generateToken } = require("../../middlewares/jwt/adminUser");
const validator = require("validator");

const saveLoginLogIntoDB = async (user, req, success, message = "") => {
  // Log login details into database
  const loginLog = new LoginLog({
    userId: user._id,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
    success,
    message,
  });
  await loginLog.save();
};

// Login Route
exports.checkLogin = async (req, res) => {
  try {
    const { email, token } = req.body;
    if (!email || !token) {
      const errData = errorData["INVALID_CREDENTIALS"];
      return failResp(res, errData.status, errData.message, errData.code);
    }

    // Find user by email
    const user = await AdminUser.findOne({ email });
    if (!user) {
      const errData = errorData["INVALID_CREDENTIALS"];
      return failResp(res, errData.status, errData.message, errData.code);
    }

    // // check if token is present in the user document
    const tokenObject = user.tokens?.find((_token) => _token.token === token);
    if (!user.tokens || tokenObject.isExpired) {
      const errData = errorData["INVALID_OR_EXPIRED_TOKEN"];
      return failResp(res, errData.status, errData.message, errData.code);
    }

    const data = {
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.mobile,
      profilePic: user.profilePic,
      lastLogin: user.lastLogin,
      userId: user._id,
    };
    return successResp(res, 200, { token, ...data }, "Login successful");
  } catch (error) {
    // res.status(500).json({ message: "Server error", error: error.message });
    // await saveLoginLogIntoDB(user, req, false, "Server Error");
    console.log(error);
    const errData = errorData["SERVER_ERROR"];
    return failResp(res, errData.status, errData.message, errData.code);
  }
};
