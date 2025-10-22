const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/vehicleOwnerController');
const authenticate = require('../middleware/authenticate');

/**
 * Factory function to create the router, accepting the DB connection.
 * All paths defined here are prefixed by the path where the router is mounted (e.g., /api/owners).
 */
module.exports = (db) => {
    // Middleware to attach the DB connection to the request object for use in controllers/services
    router.use((req, res, next) => {
        req.db = db;
        next();
    });

    /**
     * @swagger
     * /api/owners:
     *   get:
     *     tags:
     *       - Vehicle Owners
     *     summary: Get all vehicle owners
     *     description: Retrieve list of all vehicle owners. Requires authentication token.
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: Vehicle owners retrieved successfully
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
     *                   example: "Vehicle owners retrieved successfully."
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/VehicleOwner'
     *       401:
     *         description: Unauthorized - missing or invalid token
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.get('/', authenticate, ownerController.getAllOwners);

    /**
     * @swagger
     * /api/owners/{ownerId}:
     *   get:
     *     tags:
     *       - Vehicle Owners
     *     summary: Get vehicle owner by ID
     *     description: Retrieve a specific vehicle owner by their ID. Requires authentication token.
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: ownerId
     *         required: true
     *         description: Vehicle Owner ID (UUID)
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Vehicle owner retrieved successfully
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
     *                   example: "Vehicle owner retrieved successfully."
     *                 data:
     *                   $ref: '#/components/schemas/VehicleOwner'
     *       401:
     *         description: Unauthorized - missing or invalid token
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       404:
     *         description: Vehicle owner not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.get('/:ownerId', authenticate, ownerController.getOwnerById);

    /**
     * @swagger
     * /api/owners:
     *   post:
     *     tags:
     *       - Vehicle Owners
     *     summary: Create new vehicle owner
     *     description: Create a new vehicle owner record. Requires authentication token.
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - LicenseID
     *               - Name
     *               - DOB
     *               - Nationality
     *               - PhoneNumber
     *               - Address
     *             properties:
     *               LicenseID:
     *                 type: string
     *                 format: uuid
     *                 description: Reference to DrivingLicense
     *               Name:
     *                 type: string
     *                 description: Full name of owner
     *               DOB:
     *                 type: string
     *                 format: date
     *                 description: Date of birth (YYYY-MM-DD)
     *               Nationality:
     *                 type: string
     *                 description: Country of nationality
     *               PhoneNumber:
     *                 type: integer
     *                 description: Contact phone number
     *               Address:
     *                 type: string
     *                 description: Residential address
     *           example:
     *             LicenseID: "550e8400-e29b-41d4-a716-446655440000"
     *             Name: "John Smith"
     *             DOB: "1990-05-15"
     *             Nationality: "Singaporean"
     *             PhoneNumber: 98765432
     *             Address: "123 Main Street"
     *     responses:
     *       201:
     *         description: Vehicle owner created successfully
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
     *                   example: "Vehicle owner record created successfully."
     *                 data:
     *                   $ref: '#/components/schemas/VehicleOwner'
     *       400:
     *         description: Validation error or missing fields
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
    router.post('/', authenticate, ownerController.createOwner);

    /**
     * @swagger
     * /api/owners/{ownerId}:
     *   put:
     *     tags:
     *       - Vehicle Owners
     *     summary: Update vehicle owner
     *     description: Update an existing vehicle owner record. Requires authentication token.
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: ownerId
     *         required: true
     *         description: Vehicle Owner ID (UUID)
     *         schema:
     *           type: string
     *           format: uuid
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               Name:
     *                 type: string
     *               DOB:
     *                 type: string
     *                 format: date
     *               Nationality:
     *                 type: string
     *               PhoneNumber:
     *                 type: integer
     *               Address:
     *                 type: string
     *           example:
     *             Name: "John Smith Updated"
     *             Address: "456 New Street"
     *     responses:
     *       200:
     *         description: Vehicle owner updated successfully
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
     *                   example: "Vehicle owner record updated successfully."
     *                 data:
     *                   type: object
     *       401:
     *         description: Unauthorized - missing or invalid token
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       404:
     *         description: Vehicle owner not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.put('/:ownerId', authenticate, ownerController.updateOwner);

    /**
     * @swagger
     * /api/owners/{ownerId}:
     *   delete:
     *     tags:
     *       - Vehicle Owners
     *     summary: Delete vehicle owner
     *     description: Delete a vehicle owner record by ID. Requires authentication token.
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: ownerId
     *         required: true
     *         description: Vehicle Owner ID (UUID)
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Vehicle owner deleted successfully
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
     *                   example: "Vehicle owner deleted successfully."
     *                 data:
     *                   type: object
     *       401:
     *         description: Unauthorized - missing or invalid token
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       404:
     *         description: Vehicle owner not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.delete('/:ownerId', authenticate, ownerController.deleteOwner);

    return router;
};
