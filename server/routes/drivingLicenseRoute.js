const express = require('express');
const router = express.Router();

// Import the Controller layer
const licenseController = require('../controllers/drivingLicenseController');
const authenticate = require('../middleware/authenticate');

module.exports = (db) => {
    
    // ⭐ Middleware: Attach the DB object to the request
    // This allows the Controller (and subsequently the Service) to access the 
    // SQLite connection via req.db without requiring the db object to be passed explicitly 
    // in every function call, keeping the controller signature clean (req, res).
    router.use((req, res, next) => {
        req.db = db;
        next();
    });
    
    /**
     * @swagger
     * /api/licenses:
     *   get:
     *     tags:
     *       - Driving Licenses
     *     summary: Get all driving licenses
     *     description: Retrieve list of all driving licenses. Requires authentication token.
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: Licenses retrieved successfully
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
     *                   example: "Licenses retrieved successfully."
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/DrivingLicense'
     *       401:
     *         description: Unauthorized - missing or invalid token
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.get('/', authenticate, licenseController.getAllLicenses);
    
    /**
     * @swagger
     * /api/licenses/{licenseId}:
     *   get:
     *     tags:
     *       - Driving Licenses
     *     summary: Get driving license by ID
     *     description: Retrieve a specific driving license by ID. Requires authentication token.
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: licenseId
     *         required: true
     *         description: License ID (UUID)
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: License retrieved successfully
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
     *                   example: "License retrieved successfully."
     *                 data:
     *                   $ref: '#/components/schemas/DrivingLicense'
     *       401:
     *         description: Unauthorized - missing or invalid token
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       404:
     *         description: License not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.get('/:licenseId', authenticate, licenseController.getLicenseById);
    
    /**
     * @swagger
     * /api/licenses:
     *   post:
     *     tags:
     *       - Driving Licenses
     *     summary: Create new driving license
     *     description: Create a new driving license record. Requires authentication token.
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - LicenseClass
     *               - IssueDate
     *               - ExpiryDate
     *             properties:
     *               LicenseClass:
     *                 type: string
     *                 enum: ['A', 'B', 'C', 'D', 'E']
     *                 description: Class of driving license
     *               IssueDate:
     *                 type: string
     *                 format: date
     *                 description: Date license was issued (YYYY-MM-DD)
     *               ExpiryDate:
     *                 type: string
     *                 format: date
     *                 description: Date license expires (YYYY-MM-DD)
     *           example:
     *             LicenseClass: "Class 2A"
     *             IssueDate: "2020-01-15"
     *             ExpiryDate: "2028-01-15"
     *     responses:
     *       201:
     *         description: License created successfully
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
     *                   example: "License created successfully."
     *                 data:
     *                   $ref: '#/components/schemas/DrivingLicense'
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
    router.post('/', authenticate, licenseController.createLicense);
    
    /**
     * @swagger
     * /api/licenses/{licenseId}:
     *   put:
     *     tags:
     *       - Driving Licenses
     *     summary: Update driving license
     *     description: Update an existing driving license record. Requires authentication token.
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: licenseId
     *         required: true
     *         description: License ID (UUID)
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
     *               LicenseClass:
     *                 type: string
     *                 enum: ['A', 'B', 'C', 'D', 'E']
     *               IssueDate:
     *                 type: string
     *                 format: date
     *               ExpiryDate:
     *                 type: string
     *                 format: date
     *           example:
     *             LicenseClass: "Class 2B"
     *             IssueDate: "2020-01-15"
     *             ExpiryDate: "2028-01-15"
     *     responses:
     *       200:
     *         description: License updated successfully
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
     *                   example: "License updated successfully."
     *                 data:
     *                   type: object
     *       401:
     *         description: Unauthorized - missing or invalid token
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       404:
     *         description: License not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.put('/:licenseId', authenticate, licenseController.updateLicense);
    
    /**
     * @swagger
     * /api/licenses/{licenseId}:
     *   delete:
     *     tags:
     *       - Driving Licenses
     *     summary: Delete driving license
     *     description: Delete a driving license record by ID. Requires authentication token.
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: licenseId
     *         required: true
     *         description: License ID (UUID)
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: License deleted successfully
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
     *                   example: "License deleted successfully."
     *                 data:
     *                   type: object
     *       401:
     *         description: Unauthorized - missing or invalid token
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       404:
     *         description: License not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.delete('/:licenseId', authenticate, licenseController.deleteLicense);

    return router;
};
