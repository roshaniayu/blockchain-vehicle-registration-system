const vehiclesService = require('../services/vehiclesService');
const { successResponse, errorResponse } = require('../contracts/responseFormat');
const logger = require('../utility/logger');

module.exports = {
    /**
     * Creates a new vehicle record.
     * POST /api/vehicles/add
     * @param {object} req - Express request
     * @param {object} res - Express response
     */
    addVehicles: async (req, res) => {
    const { vehicleID, ownerID } = req.body;

    if (!vehicleID) {
        logger.warn('Create owner failed - missing required fields');
        return errorResponse(res, 'Missing one or more required fields.', 400);
    }

    try {
        // Service function returns the created object upon success
        await vehiclesService.addVehicles(req.db, vehicleID, ownerID);
        logger.database('INSERT', 'VehicleID', `SUCCESS - Created new vehicle ${vehicleID} for ${ownerID} owner`);
        return successResponse(res, 'New vehicle record created successfully.', 201, vehicleID);
    } catch (error) {
        logger.error('Failed to create new vehicle record', error.message);
        return errorResponse(res, 'Failed to create new vehicle record due to database error.', 400, error.message);
    }
    },
    /**
     * Retrieves all vehicles.
     * GET /api/vehicles
     * @param {object} req - Express request
     * @param {object} res - Express response
     */
    getAllVehicles: async (req, res) => {
        // The Controller's job is to call the Service and handle the response format.
        try {
            const Vehicles = await vehiclesService.getAllVehicles(req.db); // req.db passed from router/middleware
            
            logger.database('SELECT', 'Vehicles', `SUCCESS - Retrieved ${Vehicles.length} Vehicles`);
            return successResponse(res, 'Vehicles retrieved successfully.', 200, Vehicles);
        } catch (err) {
            logger.error('Failed to retrieve Vehicles', err.message);
            return errorResponse(res, 'Failed to retrieve Vehicles.', 500, err.message);
        }
    },
    /**
     * Retrieves a single vehicle record by OwnerID.
     * GET /api/vehicles/:ownerId
     * @param {object} req - Express request
     * @param {object} res - Express response
     */
    getVehicleByOwnerID: async (req, res) => {
       const { ownerID } = req.params;
        try {
            const Vehicles = await vehiclesService.getVehicleByOwnerID(req.db, ownerID);
            
            if (!Vehicles) {
                logger.warn(`Vehicle not found with ID: ${ownerID}`);
                return errorResponse(res, `Vehicle with ID ${ownerID} not found.`, 404, null);
            }
            
            logger.database('SELECT', `Vehicles (ID: ${ownerID})`, 'SUCCESS');
            return successResponse(res, 'Vehicle retrieved successfully.', 200, Vehicles);
        } catch (err) {
            logger.error('Failed to retrieve Vehicle', err.message);
            return errorResponse(res, 'Failed to retrieve Vehicle.', 500, err.message);
        }
    },    
    /**
     * Updates a vehicle's owner.
     * PUT /api/vehicles/:vehicleID/transfer
     * @param {object} req - Express request
     * @param {object} res - Express response
     */
    updateVehicleOwner: async (req, res) => {
        const { newOwnerID, vehicleID } = req.body;

        if (!vehicleID || !newOwnerID) {
            logger.warn('Update vehicle owner failed - missing required fields');
            return errorResponse(res, 'Missing required fields: vehicleID and newOwnerID.', 400);
        }

        try {
            const result = await vehiclesService.updateVehicleOwner(req.db, vehicleID, newOwnerID);
            logger.database('UPDATE', `Vehicles (ID: ${vehicleID})`, `SUCCESS - Transferred to ${newOwnerID}`, { newOwnerID });
            return successResponse(res, 'Vehicle owner updated successfully.', 200, result);
        } catch (error) {
            logger.error('Failed to update vehicle owner', error.message);
            const status = error.message.includes('not found') ? 404 : 400;
            return errorResponse(res, 'Failed to update vehicle owner.', status, error.message);
        }
    },

    /**
     * Updates a vehicle's for sale status.
     * PUT /api/vehicles/:vehicleID/forsale
     * @param {object} req - Express request
     * @param {object} res - Express response
     */
    updateVehicleForSaleStatus: async (req, res) => {
        const { vehicleID, forSale } = req.body; // Expecting a boolean true/false

        if (!vehicleID || typeof forSale === 'undefined') {
            logger.warn('Update vehicle for sale status failed - missing required fields');
            return errorResponse(res, 'Missing required fields: vehicleID and forSale status.', 400);
        }

        try {
            const result = await vehiclesService.updateVehicleForSaleStatus(req.db, vehicleID, forSale);
            logger.database('UPDATE', `Vehicles (ID: ${vehicleID})`, `SUCCESS - ForSale status set to ${forSale}`, { forSale });
            return successResponse(res, 'Vehicle for sale status updated successfully.', 200, result);
        } catch (error) {
            logger.error('Failed to update vehicle for sale status', error.message);
            const status = error.message.includes('not found') ? 404 : 400;
            return errorResponse(res, 'Failed to update vehicle for sale status.', status, error.message);
        }
    },

    /**
     * Retrieves all vehicles.
     * GET /api/vehicles
     * @param {object} req - Express request
     * @param {object} res - Express response
     */
    getAllSaleVehicles: async (req, res) => {
        const { ownerID } = req.params;
         try {
            const Vehicles = await vehiclesService.getAllSaleVehicles(req.db, ownerID);
            
            if (!Vehicles) {
                logger.warn(`Sale vehicle list not found with ID: ${ownerID}`);
                return errorResponse(res, `Sale vehicle list with ID ${ownerID} not found.`, 404, null);
            }
            
            logger.database('SELECT', `Sale vehicle lists (ID: ${ownerID})`, 'SUCCESS');
            return successResponse(res, 'Sale vehicle list retrieved successfully.', 200, Vehicles);
        } catch (err) {
            logger.error('Failed to retrieve Sale vehicle list', err.message);
            return errorResponse(res, 'Failed to retrieve Sale vehicle list.', 500, err.message);
        }
    },
};
