const express = require("express");
// const { register, login } = require('../controllers/authController');
const { register } = require("../../../controllers/Admin/auth/register");
const { login } = require("../../../controllers/Admin/auth/login");
const { checkLogin } = require("../../../controllers/Admin/auth/checkLogin");
const {
  validateRegistration,
  loginDataValidator,
  loginLimiter,
  loginCheckLimiter,
} = require("../../../middlewares/Admin/adminUser/adminUserMiddleware");
const { verifyToken } = require("../../../middlewares/Admin/jwt/adminUser");

const router = express.Router();

router.post("/register", validateRegistration, register);
router.post("/login", loginLimiter, loginDataValidator, login);
router.post("/checkLogin", loginCheckLimiter, verifyToken, checkLogin);

module.exports = router;
