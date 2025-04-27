const AdminUser = require("../../../models/Admin/AdminUser");
const LoginLog = require("../../../models/Admin/logs/login");
const { failResp, verifyPassword, successResp } = require("../../../utils");
const { errorData } = require("../../../utils/errorCodes");
const { generateToken } = require("../../../middlewares/jwt");

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
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await AdminUser.findOne({ email });
    if (!user) {
      const errData = errorData["INVALID_CREDENTIALS"];
      return failResp(res, errData.status, errData.message, errData.code);
    }

    // Compare password
    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = await verifyPassword(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      const errData = errorData["INVALID_CREDENTIALS"];
      // await saveLoginLogIntoDB(user, req, false, "Incorrect Password");
      return failResp(res, errData.status, errData.message, errData.code);
    }

    const { isActive } = user;
    if (!isActive) {
      const errData = errorData["ACCOUNT_NOT_ACTIVATED"];
      // @TODO: SEND OTP AND THEN SEND RESPONSE TO CLIENT.
      // await saveLoginLogIntoDB(user, req, false, "Account Not Active");
      return failResp(res, errData.status, errData.message, errData.code);
    }

    const { isBlocked } = user;
    if (isBlocked) {
      const errData = errorData["ACCOUNT_BLOCKED"];
      // await saveLoginLogIntoDB(user, req, false, "Account Blocked");
      return failResp(res, errData.status, errData.message, errData.code);
    }

    // Generate JWT token
    const token = generateToken(user);

    // Save token in database
    const tokenData = {
      token,
      isExpired: false,
      expiredAt: null,
    };
    user.tokens.push(tokenData);
    user.lastLogin = new Date();
    await user.save();
    // await saveLoginLogIntoDB(user, req, true, "Login Success");
    const data = {
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.mobile,
      profilePic: user.profilePic,
      lastLogin: user.lastLogin,
      userId: user._id,
    };
    return successResp(res, 200, { ...data, token }, "Login successful");
  } catch (error) {
    // res.status(500).json({ message: "Server error", error: error.message });
    // await saveLoginLogIntoDB(user, req, false, "Server Error");
    console.log(error);
    const errData = errorData["SERVER_ERROR"];
    return failResp(res, errData.status, errData.message, errData.code);
  }
};
