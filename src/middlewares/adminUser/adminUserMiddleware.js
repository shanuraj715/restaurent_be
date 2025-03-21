
// Middleware for validation
const validateRegistration = (req, res, next) => {
    const { name, email, password, mobile, role } = req.body;
    if (!name || name.length < 3 || name.length > 50) {
        return res.status(400).json({ message: 'Name must be between 3 and 50 characters' });
    }
    if (!email || !/.+\@.+\..+/.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if (!password || password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
        return res.status(400).json({ message: 'Invalid mobile number' });
    }
    if (role && !['admin', 'manager'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }
    next();
};

module.exports = validateRegistration;