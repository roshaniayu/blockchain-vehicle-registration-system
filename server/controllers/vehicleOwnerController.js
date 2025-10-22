const ownerService = require('../services/vehicleOwnerService');
const { successResponse, errorResponse } = require('../contracts/responseFormat');
const { randomUUID } = require('crypto'); // Use built-in crypto module for UUIDs

/**
 * Retrieves all vehicle owners.
 * GET /api/owners
 */
exports.getAllOwners = async (req, res) => {
    try {
        const owners = await ownerService.getAllOwners(req.db);
        return successResponse(res, 'Vehicle owners retrieved successfully.', 200, owners);
    } catch (error) {
        console.error('Error in getAllOwners:', error);
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
        return errorResponse(res, 'Invalid Owner ID format provided.', 400);
    }

    try {
        const owner = await ownerService.getOwnerById(req.db, ownerId);
        
        if (!owner) {
            return errorResponse(res, `Vehicle owner with ID ${ownerId} not found.`, 404);
        }
        
        return successResponse(res, 'Vehicle owner retrieved successfully.', 200, owner);
    } catch (error) {
        console.error('Error in getOwnerById:', error);
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
        return successResponse(res, 'Vehicle owner record created successfully.', 201, createdOwner);
    } catch (error) {
        console.error('Error in createOwner:', error);
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
        return errorResponse(res, 'Invalid Owner ID format provided.', 400);
    }

    if (Object.keys(updates).length === 0) {
        return errorResponse(res, 'No fields provided for update.', 400);
    }

    try {
        // Pass only the allowed update fields to the service
        const result = await ownerService.updateOwner(req.db, ownerId, updates);

        // Service throws error if changes === 0, so we only handle success here
        return successResponse(res, 'Vehicle owner record updated successfully.', 200, result);
    } catch (error) {
        console.error('Error in updateOwner:', error);
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
        return errorResponse(res, 'Invalid Owner ID format provided.', 400);
    }

    try {
        const result = await ownerService.deleteOwner(req.db, ownerId);
        
        // Service throws error if changes === 0, so we only handle success here
        return successResponse(res, `Vehicle owner with ID ${ownerId} deleted successfully.`, 200, result);
    } catch (error) {
        console.error('Error in deleteOwner:', error);
        const status = error.message.includes('not found') ? 404 : 500;
        return errorResponse(res, 'Failed to delete vehicle owner record.', status, error.message);
    }
};
