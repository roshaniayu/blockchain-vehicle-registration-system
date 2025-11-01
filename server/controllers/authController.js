const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../contracts/responseFormat');
const { generateToken } = require('../utility/authUtils');
const { randomUUID } = require('crypto');
const logger = require('../utility/logger');

/**
 * Authentication Controller - Handles login, register, and logout endpoints
 */
module.exports = {
    /**
     * Handle user login
     * POST /auth/login
     * @param {object} req - Express request
     * @param {object} res - Express response
     */
    login: async (req, res) => {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            logger.auth('LOGIN', username || 'unknown', 'FAILED - Missing fields');
            return errorResponse(res, 'Missing required fields: username and password.', 400, null);
        }

        try {
            // Authenticate user
            const user = await authService.authenticateUser(req.db, username, password);

            if (!user) {
                logger.auth('LOGIN', username, 'FAILED - Invalid credentials');
                return errorResponse(res, 'Invalid username or password.', 401, null);
            }

            // Generate JWT token
            const token = generateToken(user);

            logger.auth('LOGIN', username, 'SUCCESS', { userId: user.ID, userType: user.UserType });
            return successResponse(res, 'Login successful.', 200, {
                token,
                user: {
                    id: user.ID,
                    username: user.Username,
                    userType: user.UserType,
                    ownerId: user.OwnerID
                }
            });
        } catch (err) {
            logger.error('Login error', err.message);
            return errorResponse(res, 'Failed to authenticate user.', 500, err.message);
        }
    },

    /**
     * Handle user registration
     * POST /auth/register
     * @param {object} req - Express request
     * @param {object} res - Express response
     */
    register: async (req, res) => {
        const { username, password, ownerID, userType } = req.body;

        // Validation
        if (!username || !password) {
            logger.auth('REGISTER', username || 'unknown', 'FAILED - Missing fields');
            return errorResponse(res, 'Missing required fields: username and password.', 400, null);
        }

        if (password.length < 6) {
            logger.auth('REGISTER', username, 'FAILED - Password too short');
            return errorResponse(res, 'Password must be at least 6 characters long.', 400, null);
        }

        try {
            // Check if username already exists
            const usernameAlreadyExists = await authService.usernameExists(req.db, username);
            if (usernameAlreadyExists) {
                logger.auth('REGISTER', username, 'FAILED - Username exists');
                return errorResponse(res, 'Username already exists.', 400, null);
            }

            // Hash password
            const hashedPassword = await authService.hashPassword(password);

            // Register user
            const userData = {
                ID: randomUUID(),
                OwnerID: ownerID || null,
                Username: username,
                Password: hashedPassword,
                CreatedDate: new Date().toISOString(),
                UserType: userType || 'VehicleOwner'
            };

            const newUser = await authService.registerUser(req.db, userData);
            
            logger.auth('REGISTER', username, 'SUCCESS', { userId: newUser.ID, userType: newUser.UserType });
            return successResponse(res, 'User registered successfully.', 201, newUser);
        } catch (err) {
            logger.error('Registration error', err.message);
            const statusCode = err.message.includes('SQLITE_CONSTRAINT') ? 400 : 500;
            return errorResponse(res, 'Failed to register user.', statusCode, err.message);
        }
    },

    /**
     * Handle user logout
     * POST /auth/logout
     * @param {object} req - Express request
     * @param {object} res - Express response
     */
    logout: async (req, res) => {
        try {
            logger.auth('LOGOUT', 'user', 'SUCCESS');
            return successResponse(res, 'Logout successful. Please remove token from client storage.', 200, null);
        } catch (err) {
            logger.error('Logout error', err.message);
            return errorResponse(res, 'Failed to logout.', 500, err.message);
        }
    },

    /**
     * Verify token validity and return user info
     * POST /auth/verify-token
     * @param {object} req - Express request
     * @param {object} res - Express response
     */
    verifyToken: async (req, res) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                logger.auth('VERIFY_TOKEN', 'unknown', 'FAILED - Missing authorization header');
                return errorResponse(res, 'Missing or invalid authorization header.', 401, 'Authorization header must be in format: Bearer <token>');
            }

            const token = authHeader.slice(7);
            const { verifyToken } = require('../utility/authUtils');
            const decoded = verifyToken(token);

            if (!decoded) {
                logger.auth('VERIFY_TOKEN', 'unknown', 'FAILED - Invalid token');
                return errorResponse(res, 'Invalid or expired token.', 401, 'Token is not valid');
            }

            // Fetch full user data from database
            const user = await authService.getUserById(req.db, decoded.id);

            if (!user) {
                logger.auth('VERIFY_TOKEN', decoded.username || 'unknown', 'FAILED - User not found');
                return errorResponse(res, 'User not found.', 401, 'The user associated with this token no longer exists');
            }

            // Check if account is active
            if (!user.Activate) {
                logger.auth('VERIFY_TOKEN', user.Username, 'FAILED - Account deactivated');
                return errorResponse(res, 'Account deactivated.', 403, 'Your account has been deactivated');
            }

            logger.auth('VERIFY_TOKEN', user.Username, 'SUCCESS', { userId: user.ID, userType: user.UserType });
            return successResponse(res, 'Token is valid.', 200, {
                user: {
                    id: user.ID,
                    ownerId: user.OwnerID,
                    username: user.Username,
                    userType: user.UserType,
                    walletAddress: user.WalletAddress,
                    createdDate: user.CreatedDate,
                    activate: user.Activate
                }
            });
        } catch (err) {
            logger.error('Token verification error', err.message);
            return errorResponse(res, 'Authentication error.', 401, err.message);
        }
    }
};
