const express = require("express");
const { verifyToken } = require("../../middlewares/Admin/jwt/adminUser");
const adminMenuList = require("./adminMenuList");
const updateSettings = require("./updateSettings");
const category = require("./category/index");
const item = require("./item/index");

const router = express.Router();

// verify token first.
router.use(verifyToken);
// router.use(accessRights);

router.use("/adminMenuList", adminMenuList);
router.use("/updateSettings", updateSettings);
router.use("/category", category);
router.use("/item", item);

module.exports = router;
