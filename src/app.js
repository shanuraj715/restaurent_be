const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
// const rateLimit = require("express-rate-limit");
const { failResp } = require("./utils");
const corsMiddleware = require("./middlewares/common/cors");
// const { injectFeatureFlags } = require("./middlewares/common/featureFlags");
// const { verifyToken } = require("./middlewares/Admin/jwt/adminUser");

const app = express();

app.use(
  `/${process.env.ASSETS_DIRECTORY_NAME}`,
  express.static(process.env.ASSETS_BASE_PATH)
);

// Custom fallback for missing images
app.use("/uploads", (req, res) => {
  // Set content-type based on fallback image
  res.sendFile(process.env.NOT_FOUND_IMAGE_PATH, (err) => {
    if (err) {
      res.status(500).send("Error loading fallback image");
    }
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

// Routes
// app.use('/api/auth', require('./routes/authRoutes'));
app.use("/api/adminUser", require("./routes/Admin/auth/adminUserRoutes")); // login register
app.use("/api/admin", require("./routes/Admin/index"));

// CUSTOMERS API
app.use("/api/user", require("./routes/User/auth/index")); // login register

// common API's. Some may be for only customers.
app.use("/api/item", require("./routes/Admin/item/index"));

app.use("/api/order", require("./routes/Admin/order/order"));

app.use("/api/upload", require("./routes/Admin/upload/index"));

app.use("*", (req, res) => {
  return failResp(res, 404, "Route not found", "ROUTE_NOT_FOUND");
});

module.exports = app;
