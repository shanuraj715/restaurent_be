const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'abc';
const EXPIRATION_TIME = '24h'; // Token expires in 1 hour

// Function to generate a JWT token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
        },
        SECRET_KEY,
        {
            expiresIn: EXPIRATION_TIME
        }
    );
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.tokenUserData = decoded; // Attach user data to request object
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(403).json({ message: "Token expired. Please login again." });
        } else {
            return res.status(403).json({ message: "Invalid token." });
        }
    }
};

module.exports = { generateToken, verifyToken };
