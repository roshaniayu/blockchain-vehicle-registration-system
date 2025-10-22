const util = require('util');
const { comparePassword, hashPassword } = require('../utility/authUtils');

/**
 * Authentication Service - Handles user authentication logic
 */
module.exports = {
    /**
     * Authenticate user by username and password
     * @param {object} db - SQLite database connection
     * @param {string} username - Username
     * @param {string} password - Plain text password
     * @returns {Promise<object|null>} User object without password or null
     */
    authenticateUser: async (db, username, password) => {
        const get = util.promisify(db.get).bind(db);
        const sql = 'SELECT * FROM Users WHERE Username = ?';
        
        try {
            const user = await get(sql, [username]);
            
            if (!user) {
                return null;
            }

            // Compare passwords
            const isPasswordValid = await comparePassword(password, user.Password);
            
            if (!isPasswordValid) {
                return null;
            }

            // Return user without password
            return {
                ID: user.ID,
                OwnerID: user.OwnerID,
                Username: user.Username,
                CreatedDate: user.CreatedDate,
                UserType: user.UserType
            };
        } catch (error) {
            throw error;
        }
    },

    /**
     * Register a new user with password hashing
     * @param {object} db - SQLite database connection
     * @param {object} userData - User data including username, password, userType, etc
     * @returns {Promise<object>} Created user without password
     */
    registerUser: async (db, userData) => {
        const { ID, OwnerID, Username, Password, CreatedDate, UserType } = userData;
        
        const sql = `
            INSERT INTO Users (ID, OwnerID, Username, Password, Salt, CreatedDate, UserType) 
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;
        
        return new Promise((resolve, reject) => {
            db.run(sql, [ID, OwnerID, Username, Password, '', CreatedDate, UserType], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve({ ID, OwnerID, Username, CreatedDate, UserType });
            });
        });
    },

    /**
     * Check if username already exists
     * @param {object} db - SQLite database connection
     * @param {string} username - Username to check
     * @returns {Promise<boolean>} True if username exists
     */
    usernameExists: async (db, username) => {
        const get = util.promisify(db.get).bind(db);
        const sql = 'SELECT ID FROM Users WHERE Username = ? LIMIT 1';
        
        try {
            const user = await get(sql, [username]);
            return user !== undefined;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Hash a password
     * @param {string} password - Plain text password
     * @returns {Promise<string>} Hashed password
     */
    hashPassword: async (password) => {
        return await hashPassword(password);
    }
};
