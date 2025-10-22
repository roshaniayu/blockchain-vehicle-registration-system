const userService = require('../services/userService');
const { successResponse, errorResponse } = require('../contracts/responseFormat');

// This file exports functions that take (req, res) and handle the request lifecycle.

// This file exports functions that take (req, res) and handle the request lifecycle.

module.exports = {
    /**
     * Handles GET /users: Fetches all users.
     */
    getAllUsers: async (req, res) => {
        // The Controller's job is to call the Service and handle the response format.
        try {
            const users = await userService.getAllUsers(req.db); // req.db passed from router/middleware
            
            return successResponse(res, 'Users retrieved successfully.', 200, users);
        } catch (err) {
            return errorResponse(res, 'Failed to retrieve users.', 500, err.message);
        }
    },

    /**
     * Handles GET /users/:id: Fetches a single user.
     */
    getUserById: async (req, res) => {
        const { id } = req.params;
        
        try {
            const user = await userService.getUserById(req.db, id);
            
            if (!user) {
                return errorResponse(res, `User with ID ${id} not found.`, 404, null);
            }
            
            return successResponse(res, 'User retrieved successfully.', 200, user);
        } catch (err) {
            return errorResponse(res, 'Failed to retrieve user.', 500, err.message);
        }
    },

    /**
     * Handles POST /users: Creates a new user.
     * Note: Use /auth/register for user registration with password hashing
     */
    createUser: async (req, res) => {
        const { name, email } = req.body;

        // Controller performs validation checks
        if (!name || !email) {
            return errorResponse(res, 'Missing required fields: name and email.', 400, null);
        }

        try {
            const newUser = await userService.createUser(req.db, name, email);
            
            return successResponse(res, 'User created successfully.', 201, newUser);
        } catch (err) {
            // Check if error is due to database constraints (e.g., unique email)
            const statusCode = err.message.includes('SQLITE_CONSTRAINT') ? 400 : 500;
            return errorResponse(res, 'Failed to create user.', statusCode, err.message);
        }
    }
};
