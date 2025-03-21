const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../../models/AdminUser');
const router = express.Router();

// Registration Route
exports.register = async (req, res) => {
    // res.status(200).json({ message: 'Registration endpoint' });
    try {
        const { name, email, password, mobile, role } = req.body;

        // Check if user already exists
        const existingUser = await AdminUser.findOne({ $or: [{ email }, { mobile }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Email or Mobile already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin user
        const newUser = new AdminUser({
            name,
            email,
            password: hashedPassword,
            mobile,
            role: role || 'manager',
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// module.exports = router;
