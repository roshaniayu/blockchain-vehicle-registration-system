const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../contracts/responseFormat');
const { generateToken } = require('../utility/authUtils');
const { randomUUID } = require('crypto');

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
            return errorResponse(res, 'Missing required fields: username and password.', 400, null);
        }

        try {
            // Authenticate user
            const user = await authService.authenticateUser(req.db, username, password);

            if (!user) {
                return errorResponse(res, 'Invalid username or password.', 401, null);
            }

            // Generate JWT token
            const token = generateToken(user);

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
            console.error('Error in login:', err);
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
            return errorResponse(res, 'Missing required fields: username and password.', 400, null);
        }

        if (password.length < 6) {
            return errorResponse(res, 'Password must be at least 6 characters long.', 400, null);
        }

        try {
            // Check if username already exists
            const usernameAlreadyExists = await authService.usernameExists(req.db, username);
            if (usernameAlreadyExists) {
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
            
            return successResponse(res, 'User registered successfully.', 201, newUser);
        } catch (err) {
            console.error('Error in register:', err);
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
            return successResponse(res, 'Logout successful. Please remove token from client storage.', 200, null);
        } catch (err) {
            console.error('Error in logout:', err);
            return errorResponse(res, 'Failed to logout.', 500, err.message);
        }
    }
};
