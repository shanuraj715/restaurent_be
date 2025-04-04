const express = require("express");
const { failResp, successResp } = require("../../utils");

const router = express.Router();

router.get("/", (req, res) => {
  return res.json({
    message: "This is the menu list",
    menu: [
      { id: 1, name: "Dashboard" },
      { id: 2, name: "Settings" },
      { id: 3, name: "Profile" },
    ],
  });
});

module.exports = router;
