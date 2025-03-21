const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

// Routes
// app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/adminUser', require('./routes/AdminUser/adminUserRoutes'));

module.exports = app;
