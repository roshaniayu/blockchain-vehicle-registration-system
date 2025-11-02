const { randomUUID } = require('crypto');
const bcrypt = require('bcryptjs');

/**
 * Executes all necessary schema creation and sample data insertion.
 * @param {sqlite3.Database} db - The global database connection instance.
 * @param {function} callback - Callback function (err)
 */
function initDatabase(db, callback) {
    console.log('🚀 Running database schema check and setup...');

    const now = new Date().toISOString();

    db.serialize(() => {
        // 2. VehicleOwner Table
        db.run(`
            CREATE TABLE IF NOT EXISTS VehicleOwner (
              OwnerID TEXT PRIMARY KEY,
              LicenseID TEXT NOT NULL,
              Name TEXT NOT NULL,
              DOB TEXT NOT NULL,
              Nationality TEXT NOT NULL,
              PhoneNumber INTEGER NOT NULL,
              Address TEXT NOT NULL
            );
        `, (err) => {
            if (err) return callback(err);
            console.log('✨ Table "VehicleOwner" is ready.');
        });
        
        // 3. Users Table
        db.run(`
            CREATE TABLE IF NOT EXISTS Users (
              ID TEXT PRIMARY KEY,
              OwnerID TEXT,
              Username TEXT UNIQUE NOT NULL,
              Password TEXT NOT NULL,
              WalletAddress TEXT NOT NULL,
              CreatedDate TEXT NOT NULL,
              UserType TEXT NOT NULL,
              Activate Boolean DEFAULT FALSE NOT NULL,
              FOREIGN KEY(OwnerID) REFERENCES VehicleOwner(OwnerID)
            );
        `, (err) => {
            if (err) return callback(err);
            console.log('✨ Table "Users" is ready.');
        });
         // 3. Vehicle Table
        db.run(`
            CREATE TABLE IF NOT EXISTS Vehicles (
                VehicleID TEXT NOT NULL PRIMARY KEY,
                OwnerID TEXT,
                ForSale Boolean DEFAULT FALSE NOT NULL
            );
        `, (err) => {
            if (err) return callback(err);
            console.log('✨ Table "Vehicle" is ready.');
        });
    });

   
}

module.exports = initDatabase;
