const util = require("util");

module.exports = {
  /**
   * Fetches all vehicle owners.
   * @param {object} db - The SQLite database connection object.
   * @returns {Promise<Array>} A promise that resolves with an array of owner objects.
   */
  addVehicles: async (db, vehicleID, ownerID) => {
    const all = util.promisify(db.all).bind(db);
    const sql = `
    INSERT INTO Vehicles (VehicleID, OwnerID)
    VALUES(?, ?);
    `;
    return all(sql, [vehicleID, ownerID]);
  },

  /**
   * Fetches all vehicle owners.
   * @param {object} db - The SQLite database connection object.
   * @returns {Promise<Array>} A promise that resolves with an array of owner objects.
   */
  getAllVehicles: async (db) => {
    const all = util.promisify(db.all).bind(db);
    const sql = `
    SELECT * FROM Vehicles
    `;
    return all(sql);
  },

  /**
   * Fetches all vehicle owners.
   * @param {object} db - The SQLite database connection object.
   * @returns {Promise<Array>} A promise that resolves with an array of owner objects.
   */
  getVehicleByOwnerID: async (db, ownerID) => {
    const all = util.promisify(db.all).bind(db);
    const sql = `
    SELECT v.*, vo.Name, vo.LicenseID 
    FROM Vehicles AS v
    LEFT JOIN VehicleOwner AS vo 
        ON v.OwnerID = vo.OwnerID
    WHERE v.OwnerID = ?;
    `;
    return all(sql, [ownerID]);
  },

  /**
   * Updates an existing vehicle's owner.
   * @param {object} db - The SQLite database connection object.
   * @param {string} vehicleID - The ID of the vehicle to update.
   * @param {string} ownerID - The new owner's ID.
   * @returns {Promise<object>} A promise that resolves with the number of affected rows.
   */
  updateVehicleOwner: async (db, vehicleID, ownerID) => {
    const sql = `
      UPDATE Vehicles
      SET OwnerID = ?, ForSale = 0
      WHERE VehicleID = ?;
    `;
    return new Promise((resolve, reject) => {
      db.run(sql, [ownerID, vehicleID], function (err) {
        if (err) {
          return reject(err);
        }
        if (this.changes === 0) {
          return reject(
            new Error(
              `Vehicle with ID ${vehicleID} not found or no changes were made.`
            )
          );
        }
        resolve({
          VehicleID: vehicleID,
          changes: this.changes,
          newOwnerID: ownerID,
        });
      });
    });
  },

  /**
   * Updates a vehicle's for sale status.
   * @param {object} db - The SQLite database connection object.
   * @param {string} vehicleID - The ID of the vehicle to update.
   * @param {boolean} forSale - The new for sale status.
   * @returns {Promise<object>} A promise that resolves with the number of affected rows.
   */
  updateVehicleForSaleStatus: async (db, vehicleID, forSale) => {
    const run = util.promisify(db.run).bind(db);
    const sql = `
      UPDATE Vehicles
      SET ForSale = ?
      WHERE VehicleID = ?;
    `;
    return new Promise((resolve, reject) => {
      db.run(sql, [forSale, vehicleID], function (err) {
        if (err) {
          return reject(err);
        }
      });
      resolve({
        vehicleID,
        forSale,
      });
    });
  },

  /**
   * Fetches all vehicle owners.
   * @param {object} db - The SQLite database connection object.
   * @returns {Promise<Array>} A promise that resolves with an array of owner objects.
   */
  getAllSaleVehicles: async (db, ownerID) => {
    const all = util.promisify(db.all).bind(db);
    const sql = `
    SELECT * FROM Vehicles 
    WHERE forSale = true AND ownerID != ?
    `;
    return all(sql, [ownerID]);
  },
};
