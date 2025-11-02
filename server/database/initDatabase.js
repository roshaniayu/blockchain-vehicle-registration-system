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
    let tableCount = 0;
    let totalTables = 4;

    /**
     * Helper function to handle table creation completion
     */
    const checkAllTablesCreated = () => {
        tableCount++;
        if (tableCount === totalTables) {
            insertSampleData().catch(err => {
                console.error('Error in insertSampleData:', err);
                callback(err);
            });
        }
    };

    /**
     * Inserts comprehensive sample data into the database
     */
    const insertSampleData = async () => {
        console.log('📊 Inserting sample data...');

        // Generate sample licenses
        const licenses = [
            { id: randomUUID(), class: 'Class 2A', issueDate: '2020-01-15', expiryDate: '2028-01-15' },
            { id: randomUUID(), class: 'Class 3', issueDate: '2019-03-20', expiryDate: '2027-03-20' },
            { id: randomUUID(), class: 'Class 2B', issueDate: '2021-06-10', expiryDate: '2029-06-10' },
            { id: randomUUID(), class: 'Class 3', issueDate: '2018-11-05', expiryDate: '2026-11-05' },
            { id: randomUUID(), class: 'Class 2A', issueDate: '2022-02-28', expiryDate: '2030-02-28' }
        ];

        // Generate sample owners
        const owners = [
            { id: randomUUID(), licenseId: licenses[0].id, name: 'John Doe', dob: '1985-05-15', nationality: 'Singaporean', phone: 98765432, address: '123 Orchard Rd, Singapore' },
            { id: randomUUID(), licenseId: licenses[1].id, name: 'Jane Smith', dob: '1990-08-22', nationality: 'Malaysian', phone: 98765433, address: '456 Marina Bay, Singapore' },
            { id: randomUUID(), licenseId: licenses[2].id, name: 'Robert Johnson', dob: '1982-12-10', nationality: 'Singaporean', phone: 98765434, address: '789 Clementi Ave, Singapore' },
            { id: randomUUID(), licenseId: licenses[3].id, name: 'Emily Chen', dob: '1995-03-18', nationality: 'Singaporean', phone: 98765435, address: '321 Bukit Timah Rd, Singapore' },
            { id: randomUUID(), licenseId: licenses[4].id, name: 'Michael Brown', dob: '1988-07-25', nationality: 'British', phone: 98765436, address: '654 Jurong West, Singapore' }
        ];

        // Generate sample users with hashed passwords
        const hashedPassword1 = await bcrypt.hash('password123', 10);
        const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);

        const users = [
            { id: randomUUID(), ownerId: owners[0].id, username: 'johndoe', password: hashedPassword1, walletAddress: '', createdDate: now, userType: 'VehicleOwner' },
            { id: randomUUID(), ownerId: owners[1].id, username: 'janesmith', password: hashedPassword1, walletAddress: '', createdDate: now, userType: 'VehicleOwner' },
            { id: randomUUID(), ownerId: owners[2].id, username: 'rjohnson', password: hashedPassword1, walletAddress: '', createdDate: now, userType: 'VehicleOwner' },
            { id: randomUUID(), ownerId: owners[3].id, username: 'emilychen', password: hashedPassword1, walletAddress: '', createdDate: now, userType: 'VehicleOwner' },
            { id: randomUUID(), ownerId: owners[4].id, username: 'mbrown', password: hashedPassword1, walletAddress: '', createdDate: now, userType: 'VehicleOwner' },
            { id: randomUUID(), ownerId: null, username: 'admin', password: hashedPasswordAdmin, walletAddress: '', createdDate: now, userType: 'Admin' }
        ];

        let insertCount = 0;
        const totalInserts = licenses.length + owners.length + users.length;

        /**
         * Helper function to track insert completion
         */
        const checkAllInsertsCompleted = () => {
            insertCount++;
            if (insertCount === totalInserts) {
                console.log('✅ All sample data inserted successfully.');
                callback(null);
            }
        };

        // Insert licenses
        licenses.forEach((license) => {
            db.run(
                "INSERT OR IGNORE INTO DrivingLicenses (LicenseID, LicenseClass, IssueDate, ExpiryDate) VALUES (?, ?, ?, ?)",
                [license.id, license.class, license.issueDate, license.expiryDate],
                (err) => {
                    if (err) console.error('⚠️ Error inserting license:', err.message);
                    checkAllInsertsCompleted();
                }
            );
        });

        // Insert owners
        owners.forEach((owner) => {
            db.run(
                "INSERT OR IGNORE INTO VehicleOwner (OwnerID, LicenseID, Name, DOB, Nationality, PhoneNumber, Address) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [owner.id, owner.licenseId, owner.name, owner.dob, owner.nationality, owner.phone, owner.address],
                (err) => {
                    if (err) console.error('⚠️ Error inserting owner:', err.message);
                    checkAllInsertsCompleted();
                }
            );
        });

        // Insert users
        users.forEach((user) => {
            db.run(
                "INSERT OR IGNORE INTO Users (ID, OwnerID, Username, Password, WalletAddress, CreatedDate, UserType) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [user.id, user.ownerId, user.username, user.password, user.walletAddress, user.createdDate, user.userType],
                (err) => {
                    if (err) console.error('⚠️ Error inserting user:', err.message);
                    checkAllInsertsCompleted();
                }
            );
        });
    };

    db.serialize(() => {
        // 1. DrivingLicenses Table
        db.run(`
            CREATE TABLE IF NOT EXISTS DrivingLicenses (
              LicenseID TEXT PRIMARY KEY,
              LicenseClass TEXT NOT NULL,
              IssueDate TEXT NOT NULL,
              ExpiryDate TEXT NOT NULL
            );
        `, (err) => {
            if (err) return callback(err);
            console.log('✨ Table "DrivingLicenses" is ready.');
            checkAllTablesCreated();
        });
        
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
            checkAllTablesCreated();
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
            checkAllTablesCreated();
        });
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
        checkAllTablesCreated();
    });
}

module.exports = initDatabase;
