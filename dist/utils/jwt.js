"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.generateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
function generateToken(user) {
    const token = (0, jsonwebtoken_1.sign)({ user }, 'SECRET_KEY', { expiresIn: '2h' });
    return token;
}
exports.generateToken = generateToken;
const validateToken = (req, res, next) => {
    try {
        let jwt = req.headers.authorization;
        // verify request has token
        if (!jwt) {
            return res.status(401).json({ message: 'Invalid token ' });
        }
        // remove Bearer if using Bearer Authorization mechanism
        if (jwt.toLowerCase().startsWith('bearer')) {
            jwt = jwt.slice('bearer'.length).trim();
        }
        // verify token
        const decodedToken = (0, jsonwebtoken_1.verify)(jwt, 'SECRET_KEY');
        req.user = decodedToken;
        next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ message: 'Expired token' });
            return;
        }
        res.status(500).json({ message: 'Failed to authenticate user' });
    }
};
exports.validateToken = validateToken;
