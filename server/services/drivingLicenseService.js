const util = require('util');

module.exports = {
    /**
     * Fetches all driving licenses.
     * @param {object} db - The SQLite database connection object.
     * @returns {Promise<Array>} A promise that resolves with an array of license objects.
     */
    getAllLicenses: async (db) => {
        const all = util.promisify(db.all).bind(db);
        const sql = 'SELECT * FROM DrivingLicenses ORDER BY IssueDate DESC';
        return all(sql); 
    },

    /**
     * Fetches a single driving license by LicenseID.
     * @param {object} db - The SQLite database connection object.
     * @param {string} licenseId - The UUID of the license to fetch.
     * @returns {Promise<object|undefined>} A promise that resolves with the license object or undefined.
     */
    getLicenseById: async (db, licenseId) => {
        const get = util.promisify(db.get).bind(db);
        const sql = 'SELECT * FROM DrivingLicenses WHERE LicenseID = ?';
        return get(sql, [licenseId]);
    },

    /**
     * Creates a new driving license record.
     * @param {object} db - The SQLite database connection object.
     * @param {object} licenseData - Object containing LicenseID, LicenseClass, IssueDate, ExpiryDate.
     * @returns {Promise<object>} A promise that resolves with the created license's data.
     */
    createLicense: async (db, licenseData) => {
        const { LicenseID, LicenseClass, IssueDate, ExpiryDate } = licenseData;
        
        const sql = `
            INSERT INTO DrivingLicenses (LicenseID, LicenseClass, IssueDate, ExpiryDate) 
            VALUES (?, ?, ?, ?);
        `;
        
        return new Promise((resolve, reject) => {
            db.run(sql, [LicenseID, LicenseClass, IssueDate, ExpiryDate], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve({ LicenseID, LicenseClass, IssueDate, ExpiryDate });
            });
        });
    },

    /**
     * Updates an existing driving license's details.
     * @param {object} db - The SQLite database connection object.
     * @param {string} licenseId - The UUID of the license to update.
     * @param {object} updates - Object containing fields to update (e.g., LicenseClass, ExpiryDate).
     * @returns {Promise<object>} A promise that resolves with the number of affected rows.
     */
    updateLicense: async (db, licenseId, updates) => {
        const { LicenseClass, IssueDate, ExpiryDate } = updates;
        const sql = `
            UPDATE DrivingLicenses 
            SET LicenseClass = ?, IssueDate = ?, ExpiryDate = ? 
            WHERE LicenseID = ?
        `;
        
        return new Promise((resolve, reject) => {
            db.run(sql, [LicenseClass, IssueDate, ExpiryDate, licenseId], function (err) {
                if (err) {
                    return reject(err);
                }
                if (this.changes === 0) {
                    return reject(new Error(`License with ID ${licenseId} not found or no changes were made.`));
                }
                resolve({ LicenseID: licenseId, changes: this.changes, updates });
            });
        });
    },

    /**
     * Deletes a driving license record by LicenseID.
     * @param {object} db - The SQLite database connection object.
     * @param {string} licenseId - The UUID of the license to delete.
     * @returns {Promise<object>} A promise that resolves with the number of deleted rows.
     */
    deleteLicense: async (db, licenseId) => {
        const sql = 'DELETE FROM DrivingLicenses WHERE LicenseID = ?';
        
        return new Promise((resolve, reject) => {
            db.run(sql, [licenseId], function (err) {
                if (err) {
                    return reject(err);
                }
                if (this.changes === 0) {
                    return reject(new Error(`License with ID ${licenseId} not found.`));
                }
                resolve({ LicenseID: licenseId, changes: this.changes });
            });
        });
    }
};
