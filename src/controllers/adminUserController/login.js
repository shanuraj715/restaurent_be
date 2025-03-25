const AdminUser = require("../../models/AdminUser");
const { failResp, verifyPassword, successResp } = require("../../utils");
const { errorData } = require("../../utils/errorCodes");
const { generateToken } = require("../../middlewares/jwt/adminUser");

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
    const isMatch = verifyPassword(password, user.password);
    if (!isMatch) {
      const errData = errorData["INVALID_CREDENTIALS"];
      return failResp(res, errData.status, errData.message, errData.code);
    }

    const isAccountActivated = user.isActive;
    if (!isAccountActivated) {
      const errData = errorData["INVALID_CREDENTIALS"];
      return failResp(res, errData.status, errData.message, errData.code);
    }

    // Generate JWT token
    const token = generateToken(user);

    // Save token in database
    user.tokens.push(token);
    user.lastLogin = new Date();
    await user.save();

    return successResp(res, 200, { token }, "Login successful");
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
    const errData = errorData["SERVER_ERROR"];
    return failResp(res, errData.status, errData.message, errData.code);
  }
};
