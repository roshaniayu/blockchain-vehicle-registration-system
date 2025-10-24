const express = require('express');
const router = express.Router();

// Import the Controller layer
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');

module.exports = (db) => {
    
    // ⭐ Middleware: Attach the DB object to the request
    router.use((req, res, next) => {
        req.db = db;
        next();
    });
    
    /**
     * @swagger
     * /api/users:
     *   get:
     *     tags:
     *       - Users
     *     summary: Get all users
     *     description: Retrieve list of all users. Requires authentication token.
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: Users retrieved successfully
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
     *                   example: "Users retrieved successfully."
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/User'
     *       401:
     *         description: Unauthorized - missing or invalid token
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.get('/', authenticate, userController.getAllUsers);
    
    /**
     * @swagger
     * /api/users/{id}:
     *   get:
     *     tags:
     *       - Users
     *     summary: Get user by ID
     *     description: Retrieve a specific user by their ID. Requires authentication token.
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: User ID (UUID)
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: User retrieved successfully
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
     *                   example: "User retrieved successfully."
     *                 data:
     *                   $ref: '#/components/schemas/User'
     *       401:
     *         description: Unauthorized - missing or invalid token
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       404:
     *         description: User not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.get('/:id', authenticate, userController.getUserById);
    
    /**
     * @swagger
     * /api/users:
     *   post:
     *     tags:
     *       - Users
     *     summary: Create new user
     *     description: Create a new user. Requires authentication token (admin only).
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - Username
     *               - Password
     *               - UserType
     *             properties:
     *               Username:
     *                 type: string
     *                 minLength: 3
     *                 description: Unique username
     *               Password:
     *                 type: string
     *                 minLength: 6
     *                 description: User password
     *               UserType:
     *                 type: string
     *                 enum: ['VehicleOwner', 'Admin', 'Inspector']
     *               OwnerID:
     *                 type: string
     *                 format: uuid
     *                 nullable: true
     *                 description: Optional reference to VehicleOwner
     *           example:
     *             Username: "newuser"
     *             Password: "pass123"
     *             UserType: "VehicleOwner"
     *             OwnerID: null
     *     responses:
     *       201:
     *         description: User created successfully
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
     *                   example: "User created successfully."
     *                 data:
     *                   $ref: '#/components/schemas/User'
     *       400:
     *         description: Validation error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       401:
     *         description: Unauthorized - missing or invalid token
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.post('/', authenticate, userController.createUser);

    return router;
};
