const express = require("express");
const { verifyToken } = require("../../middlewares/jwt");
const { accessRights, LIST } = require("../../middlewares/common/accessRights");
const { getSettings, updateSettings } = require("../../controllers/Admin/websiteSettings");

const router = express.Router();

// Get website settings - Public route
router.get("/", getSettings);

// Update website settings - Protected route
router.post("/update", verifyToken, accessRights(LIST.UPDATE_WEBSITE_SETTINGS), updateSettings);

module.exports = router; 