const express = require("express");
const cors = require("cors");
require("dotenv").config();
const rateLimit = require("express-rate-limit");

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
app.use("/api/adminUser", require("./routes/AdminUser/adminUserRoutes"));

module.exports = app;
