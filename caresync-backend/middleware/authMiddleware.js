import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token API but don't include password
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware to check if user is a Web Admin (Master Role)
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'Web Admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access Denied: Web Admin privileges required.' });
    }
};

// Middleware to check if user is a Hospital Admin
export const hospitalAdminOnly = (req, res, next) => {
    if (req.user && (req.user.role === 'Hospital Admin' || req.user.role === 'Web Admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Access Denied: Hospital Admin privileges required.' });
    }
};
