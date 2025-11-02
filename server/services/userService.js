const util = require('util');

// Export an object containing all user data access methods
module.exports = {
    /**
     * Fetches all users from the database.
     * Note: Does not return Password or Salt fields for security.
     * @param {object} db - The SQLite database connection object.
     * @returns {Promise<Array>} A promise that resolves with an array of user objects.
     */
    getAllUsers: async (db) => {
        const all = util.promisify(db.all).bind(db);
        const sql = 'SELECT ID, OwnerID, Username, CreatedDate, UserType, Activate, WalletAddress FROM Users ORDER BY CreatedDate DESC';
        return all(sql); 
    },

    /**
     * Fetches a single user by ID.
     * Note: Does not return Password or Salt fields for security.
     * @param {object} db - The SQLite database connection object.
     * @param {string} id - The UUID of the user to fetch.
     * @returns {Promise<object|undefined>} A promise that resolves with the user object or undefined.
     */
    getUserById: async (db, id) => {
        const get = util.promisify(db.get).bind(db);
        const sql = 'SELECT ID, OwnerID, Username, CreatedDate, UserType, Activate, WalletAddress FROM Users WHERE ID = ?';
        return get(sql, [id]);
    },

    /**
     * Creates a new user in the database.
     * @param {object} db - The SQLite database connection object.
     * @param {object} userData - Object containing all required fields.
     * @returns {Promise<object>} A promise that resolves with the created user's data.
     */
    createUser: async (db, userData) => {
        const { ID, OwnerID, Username, Password, WalletAddress, CreatedDate, UserType } = userData;
        
        const sql = `
            INSERT INTO Users (ID, OwnerID, Username, Password, WalletAddress, CreatedDate, UserType) 
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;
        
        return new Promise((resolve, reject) => {
            db.run(sql, [ID, OwnerID, Username, Password, WalletAddress, CreatedDate, UserType], function (err) {
                if (err) {
                    return reject(err);
                }
                // Return the created user's public data
                resolve({ ID, OwnerID, Username, CreatedDate, UserType });
            });
        });
    },

    /**
     * Updates an existing user's details.
     * @param {object} db - The SQLite database connection object.
     * @param {string} id - The UUID of the user to update.
     * @param {object} updates - Object containing fields to update (Username, UserType).
     * @returns {Promise<object>} A promise that resolves with the number of affected rows.
     */
    updateUser: async (db, id, updates) => {
        const { Username, UserType } = updates;
        const sql = 'UPDATE Users SET Username = ?, UserType = ? WHERE ID = ?';
        
        return new Promise((resolve, reject) => {
            db.run(sql, [Username, UserType, id], function (err) {
                if (err) {
                    return reject(err);
                }
                if (this.changes === 0) {
                    return reject(new Error(`User with ID ${id} not found or no changes were made.`));
                }
                resolve({ ID: id, changes: this.changes, updates });
            });
        });
    },

    /**
     * Updates an existing user's details.
     * @param {object} db - The SQLite database connection object.
     * @param {string} id - The UUID of the user to update.
     * @param {object} updates - Object containing fields to update (Username, UserType).
     * @returns {Promise<object>} A promise that resolves with the number of affected rows.
     */
    accActivate: async (db, id) => {
        const sql = 'UPDATE Users SET Activate = true WHERE ID = $1 OR OwnerID = $1';
        
        return new Promise((resolve, reject) => {
            db.run(sql, [id], function (err) {
                if (err) {
                    return reject(err);
                }
                if (this.changes === 0) {
                    return reject(new Error(`User with ID ${id} not found or no changes were made.`));
                }
                resolve({ ID: id, changes: this.changes });
            });
        });
    },

    /**
     * Deletes a user from the database by ID.
     * @param {object} db - The SQLite database connection object.
     * @param {string} id - The UUID of the user to delete.
     * @returns {Promise<object>} A promise that resolves with the number of deleted rows.
     */
    deleteUser: async (db, id) => {
        const sql = 'DELETE FROM Users WHERE ID = ?';
        
        return new Promise((resolve, reject) => {
            db.run(sql, [id], function (err) {
                if (err) {
                    return reject(err);
                }
                if (this.changes === 0) {
                    return reject(new Error(`User with ID ${id} not found.`));
                }
                resolve({ ID: id, changes: this.changes });
            });
        });
    }
};
