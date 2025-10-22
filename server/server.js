const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// --- Import Swagger Documentation ---
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// --- Import Initialization Function ---
const runInitialization = require('./database/initDatabase');
// --- Import Router Files ---
const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const ownerRoutes = require('./routes/vehicleOwnerRoute');
const licenseRoutes = require('./routes/drivingLicenseRoute');
// ---------------------------

const app = express();
const PORT = process.env.PORT || 3000;

// Define paths
const DB_DIR = path.resolve(__dirname, 'database');
const DB_PATH = path.join(DB_DIR, 'mydb.db');

// --- DATABASE CONNECTION SETUP ---

// Ensure the database directory exists before connecting
if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
    console.log(`📂 Created database directory at: ${DB_DIR}`);
}

// Global database connection instance
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        // Log connection error, but server will continue to run
        console.error('❌ Could not establish database connection:', err.message);
    } else {
        // The database file is just opened here; schema is created on /api/init
        console.log('✅ Connected to the SQLite database at:', DB_PATH);
    }
});


// --- GLOBAL MIDDLEWARE ---
app.use(express.json());

// --- SWAGGER API DOCUMENTATION ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { 
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Vehicle Registration API Docs',
}));


// --- API ROUTER DEFINITION (Prefixes all functional routes with /api) ---
const apiRouter = express.Router();

// Route 1: Database Initialization
// Accessible via: POST /api/init
apiRouter.get('/init', (req, res) => {
    // Pass the global db connection instance to the initialization script
    runInitialization(db, (err) => { 
        if (err) {
            return res.status(500).json({ 
                status: 'error',
                message: 'Database initialization failed', 
                details: err.message 
            });
        }
        res.status(200).json({ status: 'success', message: 'Database initialization complete and tables created/checked.', data: null });
    });
});


// --- MOUNT ALL RESOURCE ROUTERS ---
// Pass the database connection instance (db) to each router
apiRouter.use('/auth', authRoutes(db));
apiRouter.use('/users', userRoutes(db));
apiRouter.use('/owners', ownerRoutes(db));
apiRouter.use('/licenses', licenseRoutes(db));

// --- MOUNT THE API ROUTER ---
// This line makes all routes defined in apiRouter accessible under the /api path.
app.use('/api', apiRouter);


// --- ROOT WELCOME ROUTE ---
app.get('/', (req, res) => {
    res.send('API Server is running. <br> - API endpoints: /api <br> - API Docs: /api-docs <br> - Initialize DB: GET /api/init');
});


// --- SERVER STARTUP AND SHUTDOWN ---

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});
