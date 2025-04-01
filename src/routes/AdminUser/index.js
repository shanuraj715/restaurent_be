const express = require("express");
const { verifyToken } = require("../../middlewares/jwt/adminUser");
const adminMenuList = require("./adminMenuList");
const updateSettings = require("./updateSettings");

const router = express.Router();

// verify token first.
router.use(verifyToken);

router.use("/adminMenuList", adminMenuList);
router.use("/updateSettings", updateSettings);

module.exports = router;
