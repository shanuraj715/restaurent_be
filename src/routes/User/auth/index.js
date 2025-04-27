const express = require("express");
// const { register, login } = require('../controllers/authController');
const { register } = require("../../../controllers/User/auth/register");
const { login } = require("../../../controllers/User/auth/login");
const { fetchAccount } = require("../../../controllers/User/auth/fetchAccount");

const { verifyToken } = require("../../../middlewares/jwt");
// const { login } = require("../../../controllers/Admin/auth/login");
// const { checkLogin } = require("../../../controllers/Admin/auth/checkLogin");
const {
  validateRegistration,
  loginDataValidator,
  loginLimiter,
  loginCheckLimiter,
} = require("../../../middlewares/Admin/adminUser/adminUserMiddleware");
const {
  validateRegistrationFields,
  validateLoginFields,
} = require("../../../middlewares/User/middlewares");

const router = express.Router();

router.post("/register", loginLimiter, validateRegistrationFields, register);
router.post("/login", loginLimiter, validateLoginFields, login);
router.get("/profile", verifyToken, fetchAccount);

module.exports = router;
