const ownerService = require('../services/vehicleOwnerService');
const { successResponse, errorResponse } = require('../contracts/responseFormat');
const { randomUUID } = require('crypto'); // Use built-in crypto module for UUIDs
const logger = require('../utility/logger');

/**
 * Retrieves all vehicle owners.
 * GET /api/owners
 */
exports.getAllOwners = async (req, res) => {
    try {
        const owners = await ownerService.getAllOwners(req.db);
        logger.database('SELECT', 'VehicleOwner', `SUCCESS - Retrieved ${owners.length} owners`);
        return successResponse(res, 'Vehicle owners retrieved successfully.', 200, owners);
    } catch (error) {
        logger.error('Failed to retrieve vehicle owners', error.message);
        return errorResponse(res, 'Failed to retrieve vehicle owners.', 500, error.message);
    }
};

/**
 * Retrieves a single vehicle owner by OwnerID.
 * GET /api/owners/:ownerId
 */
exports.getOwnerById = async (req, res) => {
    const { ownerId } = req.params;

    // Basic validation check for UUID format consistency
    if (!ownerId || ownerId.length < 36) { 
        logger.warn(`Invalid Owner ID format: ${ownerId}`);
        return errorResponse(res, 'Invalid Owner ID format provided.', 400);
    }

    try {
        const owner = await ownerService.getOwnerById(req.db, ownerId);
        
        if (!owner) {
            logger.warn(`Vehicle owner not found with ID: ${ownerId}`);
            return errorResponse(res, `Vehicle owner with ID ${ownerId} not found.`, 404);
        }
        
        logger.database('SELECT', `VehicleOwner (ID: ${ownerId})`, 'SUCCESS');
        return successResponse(res, 'Vehicle owner retrieved successfully.', 200, owner);
    } catch (error) {
        logger.error('Failed to retrieve vehicle owner', error.message);
        return errorResponse(res, 'Failed to retrieve vehicle owner.', 500, error.message);
    }
};

/**
 * Creates a new vehicle owner record.
 * POST /api/owners
 */
exports.createOwner = async (req, res) => {
    // Controller validation: Ensure required fields are present
    const { LicenseID, Name, DOB, Nationality, PhoneNumber, Address } = req.body;
    
    if (!LicenseID || !Name || !DOB || !Nationality || !PhoneNumber || !Address) {
        logger.warn('Create owner failed - missing required fields');
        return errorResponse(res, 'Missing one or more required fields.', 400);
    }

    // Generate a new UUID for the primary key (OwnerID)
    const newOwnerId = randomUUID();
    
    const ownerData = {
        OwnerID: newOwnerId,
        LicenseID,
        Name,
        DOB,
        Nationality,
        PhoneNumber,
        Address
    };

    try {
        // Service function returns the created object upon success
        const createdOwner = await ownerService.createOwner(req.db, ownerData);
        logger.database('INSERT', 'VehicleOwner', `SUCCESS - Created owner ${newOwnerId}`, { Name, LicenseID });
        return successResponse(res, 'Vehicle owner record created successfully.', 201, createdOwner);
    } catch (error) {
        logger.error('Failed to create vehicle owner record', error.message);
        return errorResponse(res, 'Failed to create vehicle owner record due to database error.', 400, error.message);
    }
};

/**
 * Updates an existing vehicle owner record.
 * PUT /api/owners/:ownerId
 */
exports.updateOwner = async (req, res) => {
    const { ownerId } = req.params;
    // Controller validation: Ensure at least one field is being updated
    const updates = req.body;

    if (!ownerId || ownerId.length < 36) {
        logger.warn(`Invalid Owner ID format: ${ownerId}`);
        return errorResponse(res, 'Invalid Owner ID format provided.', 400);
    }

    if (Object.keys(updates).length === 0) {
        logger.warn('Update owner failed - no fields provided');
        return errorResponse(res, 'No fields provided for update.', 400);
    }

    try {
        // Pass only the allowed update fields to the service
        const result = await ownerService.updateOwner(req.db, ownerId, updates);

        logger.database('UPDATE', `VehicleOwner (ID: ${ownerId})`, 'SUCCESS', updates);
        // Service throws error if changes === 0, so we only handle success here
        return successResponse(res, 'Vehicle owner record updated successfully.', 200, result);
    } catch (error) {
        logger.error('Failed to update vehicle owner record', error.message);
        // The service layer returns specific errors for 'not found' cases
        const status = error.message.includes('not found') ? 404 : 400;
        return errorResponse(res, 'Failed to update vehicle owner record.', status, error.message);
    }
};

/**
 * Deletes a vehicle owner record by ID.
 * DELETE /api/owners/:ownerId
 */
exports.deleteOwner = async (req, res) => {
    const { ownerId } = req.params;

    if (!ownerId || ownerId.length < 36) {
        logger.warn(`Invalid Owner ID format: ${ownerId}`);
        return errorResponse(res, 'Invalid Owner ID format provided.', 400);
    }

    try {
        const result = await ownerService.deleteOwner(req.db, ownerId);
        
        logger.database('DELETE', `VehicleOwner (ID: ${ownerId})`, 'SUCCESS');
        // Service throws error if changes === 0, so we only handle success here
        return successResponse(res, `Vehicle owner with ID ${ownerId} deleted successfully.`, 200, result);
    } catch (error) {
        logger.error('Failed to delete vehicle owner record', error.message);
        const status = error.message.includes('not found') ? 404 : 500;
        return errorResponse(res, 'Failed to delete vehicle owner record.', status, error.message);
    }
};
