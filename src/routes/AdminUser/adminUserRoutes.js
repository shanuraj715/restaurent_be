const express = require("express");
// const { register, login } = require('../controllers/authController');
const { register } = require("../../controllers/adminUserController/register");
const { login } = require("../../controllers/adminUserController/login");
const {
  checkLogin,
} = require("../../controllers/adminUserController/checkLogin");
const {
  validateRegistration,
  loginDataValidator,
  loginLimiter,
  loginCheckLimiter,
} = require("../../middlewares/adminUser/adminUserMiddleware");

const router = express.Router();

router.post("/register", validateRegistration, register);
router.post("/login", loginLimiter, loginDataValidator, login);
router.post("/checkLogin", loginCheckLimiter, checkLogin);

module.exports = router;
