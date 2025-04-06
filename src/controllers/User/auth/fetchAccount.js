const express = require("express");
const router = express.Router();
const CustomerAccountModel = require("../../../models/User/User");
const { successResp, failResp } = require("../../../utils");

// @route   GET /api/customer/check-login
// @desc    Validate current login session (via token)
// @access  Private (customer)
exports.fetchAccount = async (req, res) => {
  try {
    const user = req.tokenUserData;
    const token = req.headers.authorization?.split(" ")[1];

    // const user = await CustomerAccountModel.findById(userId).select(
    //   "-password -otps"
    // );

    // if (!user) {
    //   return failResp(res, 404, "User not found", "USER_NOT_FOUND");
    // }

    // Check if token exists and is not expired
    const validToken = user.tokens.find(
      (t) => t.token === token && !t.isExpired
    );

    if (!validToken) {
      return failResp(
        res,
        401,
        "Session expired or token revoked. Please login again.",
        "TOKEN_INVALID_OR_EXPIRED"
      );
    }

    return successResp(res, 200, user, "User session is valid");
  } catch (err) {
    console.error("Error validating customer session:", err);
    return failResp(res, 500, "Server error", "INTERNAL_ERROR");
  }
};
