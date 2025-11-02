const express = require('express');
const router = express.Router();

// Import the Auth Controller
const authController = require('../controllers/authController');

module.exports = (db) => {
    
    // ⭐ Middleware: Attach the DB object to the request
    router.use((req, res, next) => {
        req.db = db;
        next();
    });
    
    /**
     * @swagger
     * /api/auth/login:
     *   post:
     *     tags:
     *       - Authentication
     *     summary: User login
     *     description: Authenticate user with username and password. Returns JWT token on success.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UserCredentials'
     *           example:
     *             username: "johndoe"
     *             password: "password123"
     *     responses:
     *       200:
     *         description: Login successful - returns JWT token
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: "success"
     *                 message:
     *                   type: string
     *                   example: "Login successful."
     *                 data:
     *                   $ref: '#/components/schemas/LoginResponse'
     *       400:
     *         description: Missing required fields
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       401:
     *         description: Invalid username or password
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.post('/login', authController.login);
    
    /**
     * @swagger
     * /api/auth/register:
     *   post:
     *     tags:
     *       - Authentication
     *     summary: User registration
     *     description: Register a new user with username, password, and user type.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UserRegistration'
     *           example:
     *             username: "newuser"
     *             password: "securepass123"
     *             userType: "VehicleOwner"
     *     responses:
     *       201:
     *         description: User registered successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: "success"
     *                 message:
     *                   type: string
     *                   example: "User registered successfully."
     *                 data:
     *                   $ref: '#/components/schemas/User'
     *       400:
     *         description: Validation error or duplicate username
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.post('/register', authController.register);
    
    /**
     * @swagger
     * /api/auth/logout:
     *   post:
     *     tags:
     *       - Authentication
     *     summary: User logout
     *     description: Log out current user. Client should remove token from storage.
     *     responses:
     *       200:
     *         description: Logout successful
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: "success"
     *                 message:
     *                   type: string
     *                   example: "Logout successful. Please remove token from client storage."
     *                 data:
     *                   type: 'null'
     */
    router.post('/logout', authController.logout);

    /**
     * @swagger
     * /api/auth/verify-token:
     *   post:
     *     tags:
     *       - Authentication
     *     summary: Verify token validity
     *     description: Check if JWT token is valid and return full user information.
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: Token is valid - returns user information
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: "success"
     *                 message:
     *                   type: string
     *                   example: "Token is valid."
     *                 data:
     *                   type: object
     *                   properties:
     *                     user:
     *                       $ref: '#/components/schemas/User'
     *       401:
     *         description: Invalid or expired token
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       403:
     *         description: Account deactivated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.get('/verify-token', authController.verifyToken);

    

    return router;
};
