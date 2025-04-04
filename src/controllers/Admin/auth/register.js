const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AdminUser = require("../../../models/Admin/AdminUser");
const router = express.Router();
const {
  hashPassword,
  generateOTP,
  encrypt,
  successResp,
  failResp,
  decrypt,
} = require("../../../utils/index");
const { errorData } = require("../../../utils/errorCodes");
const { DEFAULT_USER_ROLE } = require("../../../../constants");

// Registration Route
exports.register = async (req, res) => {
  // res.status(200).json({ message: 'Registration endpoint' });
  try {
    const { name, email, password, mobile, role } = req.body;

    // Check if user already exists
    const existingUser = await AdminUser.findOne({
      $or: [{ email }, { mobile }],
    });
    if (existingUser) {
      const _errorData = errorData["USER_ALREADY_EXISTS"];
      return failResp(
        res,
        _errorData.status,
        _errorData.message,
        _errorData.code
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new admin user
    const newUser = new AdminUser({
      name,
      email,
      password: hashedPassword,
      mobile,
      role: role || DEFAULT_USER_ROLE,
    });

    const data = await newUser.save();
    if (!data._id) {
      const _errorData = errorData["DB_WRITE_ERROR"];
      return failResp(
        res,
        _errorData.status,
        "Something went wrong.",
        _errorData.code
      );
    }

    const responseData = {
      token: encrypt({
        email: email,
        name: name,
        mobile: mobile,
      }),
    };
    return successResp(res, 201, responseData, "User registered successfully");
  } catch (error) {
    // console.log(error)
    // res.status(500).json({ message: 'Server error', error: error.message });
    const _errorData = errorData["SERVER_ERROR"];
    return failResp(
      res,
      _errorData.status,
      _errorData.message,
      _errorData.code
    );
  }
};

// module.exports = router;
