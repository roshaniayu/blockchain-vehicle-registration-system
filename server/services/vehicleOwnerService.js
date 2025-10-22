const util = require('util');

module.exports = {
    /**
     * Fetches all vehicle owners.
     * @param {object} db - The SQLite database connection object.
     * @returns {Promise<Array>} A promise that resolves with an array of owner objects.
     */
    getAllOwners: async (db) => {
        const all = util.promisify(db.all).bind(db);
        const sql = 'SELECT * FROM VehicleOwner ORDER BY Name';
        return all(sql); 
    },

    /**
     * Fetches a single vehicle owner by OwnerID.
     * @param {object} db - The SQLite database connection object.
     * @param {string} ownerId - The UUID of the owner to fetch.
     * @returns {Promise<object|undefined>} A promise that resolves with the owner object or undefined.
     */
    getOwnerById: async (db, ownerId) => {
        const get = util.promisify(db.get).bind(db);
        const sql = 'SELECT * FROM VehicleOwner WHERE OwnerID = ?';
        return get(sql, [ownerId]);
    },

    /**
     * Creates a new vehicle owner record.
     * @param {object} db - The SQLite database connection object.
     * @param {object} ownerData - Object containing OwnerID, LicenseID, Name, DOB, etc.
     * @returns {Promise<object>} A promise that resolves with the created owner's data.
     */
    createOwner: async (db, ownerData) => {
        const { OwnerID, LicenseID, Name, DOB, Nationality, PhoneNumber, Address } = ownerData;
        
        const sql = `
            INSERT INTO VehicleOwner (OwnerID, LicenseID, Name, DOB, Nationality, PhoneNumber, Address) 
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;
        
        return new Promise((resolve, reject) => {
            db.run(sql, [OwnerID, LicenseID, Name, DOB, Nationality, PhoneNumber, Address], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve({ OwnerID, LicenseID, Name, DOB, Nationality, PhoneNumber, Address });
            });
        });
    },

    /**
     * Updates an existing vehicle owner's details.
     * @param {object} db - The SQLite database connection object.
     * @param {string} ownerId - The UUID of the owner to update.
     * @param {object} updates - Object containing fields to update (e.g., PhoneNumber, Address).
     * @returns {Promise<object>} A promise that resolves with the number of affected rows.
     */
    updateOwner: async (db, ownerId, updates) => {
        const { Name, DOB, Nationality, PhoneNumber, Address } = updates;
        const sql = `
            UPDATE VehicleOwner 
            SET Name = ?, DOB = ?, Nationality = ?, PhoneNumber = ?, Address = ? 
            WHERE OwnerID = ?
        `;
        
        return new Promise((resolve, reject) => {
            db.run(sql, [Name, DOB, Nationality, PhoneNumber, Address, ownerId], function (err) {
                if (err) {
                    return reject(err);
                }
                if (this.changes === 0) {
                    return reject(new Error(`Owner with ID ${ownerId} not found or no changes were made.`));
                }
                resolve({ OwnerID: ownerId, changes: this.changes, updates });
            });
        });
    },

    /**
     * Deletes a vehicle owner record by OwnerID.
     * @param {object} db - The SQLite database connection object.
     * @param {string} ownerId - The UUID of the owner to delete.
     * @returns {Promise<object>} A promise that resolves with the number of deleted rows.
     */
    deleteOwner: async (db, ownerId) => {
        const sql = 'DELETE FROM VehicleOwner WHERE OwnerID = ?';
        
        return new Promise((resolve, reject) => {
            db.run(sql, [ownerId], function (err) {
                if (err) {
                    return reject(err);
                }
                if (this.changes === 0) {
                    return reject(new Error(`Owner with ID ${ownerId} not found.`));
                }
                resolve({ OwnerID: ownerId, changes: this.changes });
            });
        });
    }
};
