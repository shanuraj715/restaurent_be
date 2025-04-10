const express = require("express");
const cors = require("cors");
require("dotenv").config();
// const rateLimit = require("express-rate-limit");
const { failResp } = require("./utils");
// const { verifyToken } = require("./middlewares/Admin/jwt/adminUser");

const app = express();

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // Limit each IP to 100 requests per windowMs
//     message: { error: "Too many requests, please try again later." },
//     standardHeaders: true, // Return rate limit info in headers
//     legacyHeaders: false, // Disable X-RateLimit-* headers
// });

// app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
// app.use('/api/auth', require('./routes/authRoutes'));
app.use("/api/adminUser", require("./routes/Admin/auth/adminUserRoutes")); // login register
app.use("/api/admin", require("./routes/Admin/index"));

// CUSTOMERS API
app.use("/api/user", require("./routes/User/auth/index")); // login register

// common API's. Some may be for only customers.
app.use("/api/item", require("./routes/Admin/item/index"));

app.use("/api/order", require("./routes/Admin/order/order"));

app.use("*", (req, res) => {
  return failResp(res, 404, "Route not found", "ROUTE_NOT_FOUND");
});

module.exports = app;
