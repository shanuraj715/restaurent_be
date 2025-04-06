const express = require("express");
const {
  createOrder,
  updateOrder,
} = require("../../../controllers/Admin/order/index");
const { verifyToken } = require("../../../middlewares/Admin/jwt/adminUser");

const router = express.Router();

router.use(verifyToken);
router.post("/", createOrder);
router.post("/update", updateOrder);

module.exports = router;
