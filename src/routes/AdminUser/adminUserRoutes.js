const express = require("express");
// const { register, login } = require('../controllers/authController');
const { register } = require("../../controllers/adminUserController/register");
const { login } = require("../../controllers/adminUserController/login");
const {
  validateRegistration,
  loginLimiter,
} = require("../../middlewares/adminUser/adminUserMiddleware");

const router = express.Router();

router.post("/register", validateRegistration, register);
router.post("/login", loginLimiter, login);

module.exports = router;
