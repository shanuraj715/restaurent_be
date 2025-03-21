const express = require('express');
// const { register, login } = require('../controllers/authController');
const { register } = require('../../controllers/adminUserController/register');
const validateRegistration = require('../../middlewares/adminUser/adminUserMiddleware');

const router = express.Router();

router.post('/register', validateRegistration, register);
// router.post('/adminUser/login', login);

module.exports = router;
