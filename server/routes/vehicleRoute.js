const express = require("express");
const router = express.Router();
const vehiclesController = require("../controllers/vehicles.Controller");
const authenticate = require("../middleware/authenticate");

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
   * /api/vehicles/add:
   *   post:
   *     tags:
   *       - Vehicles
   *     summary: Add a new vehicle
   *     description: Creates a new vehicle record.
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/NewVehicle'
   *     responses:
   *       201:
   *         description: New vehicle record created successfully.
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
   *                   example: "New vehicle record created successfully."
   *                 data:
   *                   type: string
   *                   format: uuid
   *                   description: The ID of the newly created vehicle.
   *       400:
   *         description: Missing required fields or database error.
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
  router.post("/add", authenticate, vehiclesController.addVehicles);

  /**
   * @swagger
   * /api/vehicles:
   *   get:
   *     tags:
   *       - Vehicles
   *     summary: Get all vehicles
   *     description: Retrieve a list of all vehicle records.
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: Vehicles retrieved successfully.
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
   *                   example: "Vehicles retrieved successfully."
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Vehicle'
   *       401:
   *         description: Unauthorized - missing or invalid token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         description: Failed to retrieve vehicles due to a server error.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get("/", authenticate, vehiclesController.getAllVehicles);

  /**
   * @swagger
   * /api/vehicles/{ownerID}:
   *   get:
   *     tags:
   *       - Vehicles
   *     summary: Get vehicles by owner ID
   *     description: Retrieve a list of vehicles owned by a specific owner ID.
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: ownerID
   *         required: true
   *         description: The UUID of the owner to retrieve vehicles for.
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Vehicles retrieved successfully for the specified owner.
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
   *                   example: "Vehicles retrieved successfully."
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Vehicle'
   *       401:
   *         description: Unauthorized - missing or invalid token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: No vehicles found for the specified owner ID.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         description: Failed to retrieve vehicles due to a server error.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get("/:ownerID", authenticate, vehiclesController.getVehicleByOwnerID);

  /**
   * @swagger
   * /api/vehicles/transfer:
   *   post:
   *     tags:
   *       - Vehicles
   *     summary: Transfer vehicle ownership
   *     description: Transfers a vehicle to a new owner.
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - vehicleID
   *               - newOwnerID
   *             properties:
   *               vehicleID:
   *                 type: string
   *                 format: uuid
   *                 description: The ID of the vehicle to transfer.
   *               newOwnerID:
   *                 type: string
   *                 format: uuid
   *                 description: The ID of the new owner.
   *     responses:
   *       200:
   *         description: Vehicle owner updated successfully.
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
   *                   example: "Vehicle owner updated successfully."
   *                 data:
   *                   type: object
   *                   properties:
   *                     VehicleID:
   *                       type: string
   *                     changes:
   *                       type: integer
   *                     newOwnerID:
   *                       type: string
   *       400:
   *         description: Missing required fields or database error.
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
   *       404:
   *         description: Vehicle not found.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */ 
  router.post("/transfer", authenticate, vehiclesController.updateVehicleOwner);
  
  /**
   * @swagger
   * /api/vehicles/salestatus:
   *   post:
   *     tags:
   *       - Vehicles
   *     summary: Update vehicle for sale status
   *     description: Updates a vehicle's 'for sale' status.
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - vehicleID
   *               - forSale
   *             properties:
   *               vehicleID:
   *                 type: string
   *                 format: uuid
   *                 description: The ID of the vehicle to update.
   *               forSale:
   *                 type: boolean
   *                 description: Boolean indicating if the vehicle is for sale (true) or not (false).
   *     responses:
   *       200:
   *         description: Vehicle for sale status updated successfully.
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
   *                   example: "Vehicle for sale status updated successfully."
   *                 data:
   *                   type: object
   *                   properties:
   *                     VehicleID:
   *                       type: string
   *                     changes:
   *                       type: integer
   *                     forSale:
   *                       type: boolean
   *       400:
   *         description: Missing required fields or database error.
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
   *       404:
   *         description: Vehicle not found.
   *         content:
   *           application /json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.post("/salestatus", authenticate, vehiclesController.updateVehicleForSaleStatus);

  
    /**
   * @swagger
   * /api/vehicles/salelist:
   *   post:
   *     tags:
   *       - Vehicles
   *     summary: Update vehicle for sale status
   *     description: Updates a vehicle's 'for sale' status.
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - vehicleID
   *               - forSale
   *             properties:
   *               vehicleID:
   *                 type: string
   *                 format: uuid
   *                 description: The ID of the vehicle to update.
   *               forSale:
   *                 type: boolean
   *                 description: Boolean indicating if the vehicle is for sale (true) or not (false).
   *     responses:
   *       200:
   *         description: Vehicle for sale status updated successfully.
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
   *                   example: "Vehicle for sale status updated successfully."
   *                 data:
   *                   type: object
   *                   properties:
   *                     VehicleID:
   *                       type: string
   *                     changes:
   *                       type: integer
   *                     forSale:
   *                       type: boolean
   *       400:
   *         description: Missing required fields or database error.
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
   *       404:
   *         description: Vehicle not found.
   *         content:
   *           application /json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get("/salelist/:ownerID", authenticate, vehiclesController.getAllSaleVehicles);

  return router;
};
