const { verifyToken } = require('../utility/authUtils');

/**
 * Middleware to verify JWT token from Authorization header
 * Attaches decoded user data to req.user if valid
 */
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 'error',
                message: 'Missing or invalid authorization header',
                details: 'Authorization header must be in format: Bearer <token>'
            });
        }

        const token = authHeader.slice(7); // Remove 'Bearer ' prefix
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid or expired token',
                details: 'Please login again to get a new token'
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: 'Authentication error',
            details: error.message
        });
    }
};

module.exports = authenticate;
