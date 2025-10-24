const licenseService = require("../services/drivingLicenseService");
const {
  successResponse,
  errorResponse,
} = require("../contracts/responseFormat");
const { randomUUID } = require("crypto"); // ⭐ CORRECTED: Using built-in crypto module for UUIDs
const logger = require('../utility/logger');

/**
 * Retrieves all driving licenses.
 * GET /api/licenses
 */
exports.getAllLicenses = async (req, res) => {
  try {
    const licenses = await licenseService.getAllLicenses(req.db);
    logger.database('SELECT', 'DrivingLicenses', `SUCCESS - Retrieved ${licenses.length} licenses`);
    return successResponse(
      res,
      "Licenses retrieved successfully.",
      200,
      licenses
    );
  } catch (error) {
    logger.error('Failed to retrieve licenses', error.message);
    return errorResponse(
      res,
      "Failed to retrieve licenses.",
      500,
      error.message
    );
  }
};

/**
 * Retrieves a single driving license by ID.
 * GET /api/licenses/:licenseId
 */
exports.getLicenseById = async (req, res) => {
  const { licenseId } = req.params;

  // Basic validation check for UUID format consistency
  if (!licenseId || licenseId.length < 36) {
    logger.warn(`Invalid License ID format: ${licenseId}`);
    return errorResponse(res, "Invalid License ID format provided.", 400);
  }

  try {
    const license = await licenseService.getLicenseById(req.db, licenseId);

    if (!license) {
      logger.warn(`License not found with ID: ${licenseId}`);
      return errorResponse(res, `License with ID ${licenseId} not found.`, 404);
    }

    logger.database('SELECT', `DrivingLicenses (ID: ${licenseId})`, 'SUCCESS');
    return successResponse(
      res,
      "License retrieved successfully.",
      200,
      license
    );
  } catch (error) {
    logger.error('Failed to retrieve license', error.message);
    return errorResponse(
      res,
      "Failed to retrieve license.",
      500,
      error.message
    );
  }
};

/**
 * Creates a new driving license record.
 * POST /api/licenses
 */
exports.createLicense = async (req, res) => {
  // Controller validation: Ensure required fields are present
  const { LicenseClass, IssueDate, ExpiryDate } = req.body;

  if (!LicenseClass || !IssueDate || !ExpiryDate) {
    logger.warn('Create license failed - missing required fields');
    return errorResponse(
      res,
      "Missing required fields: LicenseClass, IssueDate, ExpiryDate.",
      400
    );
  }

  // Generate a new UUID for the primary key using built-in method
  const newLicenseId = randomUUID();

  const licenseData = {
    LicenseID: newLicenseId,
    LicenseClass,
    IssueDate,
    ExpiryDate,
  };

  try {
    // Service function returns the created object upon success
    const createdLicense = await licenseService.createLicense(
      req.db,
      licenseData
    );
    logger.database('INSERT', 'DrivingLicenses', `SUCCESS - Created license ${newLicenseId}`, { LicenseClass, IssueDate, ExpiryDate });
    return successResponse(
      res,
      "License created successfully.",
      201,
      createdLicense
    );
  } catch (error) {
    logger.error('Failed to create license', error.message);
    // Handle potential unique constraint errors (less likely for LicenseID, but good practice)
    return errorResponse(
      res,
      "Failed to create license.",
      error.message.includes("SQLITE_CONSTRAINT") ? 400 : 500,
      error.message
    );
  }
};

/**
 * Updates an existing driving license record.
 * PUT /api/licenses/:licenseId
 */
exports.updateLicense = async (req, res) => {
  const { licenseId } = req.params;
  // Controller validation: Ensure at least one field is being updated
  const updates = req.body;

  if (!licenseId || licenseId.length < 36) {
    logger.warn(`Invalid License ID format: ${licenseId}`);
    return errorResponse(res, "Invalid License ID format provided.", 400);
  }

  if (Object.keys(updates).length === 0) {
    logger.warn('Update license failed - no fields provided');
    return errorResponse(res, "No fields provided for update.", 400);
  }

  try {
    // Ensure the LicenseClass, IssueDate, and ExpiryDate fields are correctly structured
    const { LicenseClass, IssueDate, ExpiryDate } = updates;

    // Pass only the allowed update fields to the service
    const result = await licenseService.updateLicense(req.db, licenseId, {
      LicenseClass,
      IssueDate,
      ExpiryDate,
    });

    logger.database('UPDATE', `DrivingLicenses (ID: ${licenseId})`, 'SUCCESS', updates);
    // Service throws error if changes === 0, so we only need to handle success here
    return successResponse(res, "License updated successfully.", 200, result);
  } catch (error) {
    logger.error('Failed to update license', error.message);
    // The service layer returns specific errors for 'not found' cases
    const status = error.message.includes("not found") ? 404 : 400;
    return errorResponse(
      res,
      "Failed to update license.",
      status,
      error.message
    );
  }
};

/**
 * Deletes a driving license record by ID.
 * DELETE /api/licenses/:licenseId
 */
exports.deleteLicense = async (req, res) => {
  const { licenseId } = req.params;

  if (!licenseId || licenseId.length < 36) {
    logger.warn(`Invalid License ID format: ${licenseId}`);
    return errorResponse(res, "Invalid License ID format provided.", 400);
  }

  try {
    const result = await licenseService.deleteLicense(req.db, licenseId);

    logger.database('DELETE', `DrivingLicenses (ID: ${licenseId})`, 'SUCCESS');
    // Service throws error if changes === 0, so we only need to handle success here
    return successResponse(
      res,
      `License with ID ${licenseId} deleted successfully.`,
      200,
      result
    );
  } catch (error) {
    logger.error('Failed to delete license', error.message);
    const status = error.message.includes("not found") ? 404 : 500;
    return errorResponse(
      res,
      "Failed to delete license.",
      status,
      error.message
    );
  }
};
