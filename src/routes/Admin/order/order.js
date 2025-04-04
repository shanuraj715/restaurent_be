const express = require("express");
const { createOrder } = require("../../../controllers/User/order/index");

const router = express.Router();

router.post("/create", createOrder);

module.exports = router;
