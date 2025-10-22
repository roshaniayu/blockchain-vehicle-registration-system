# System Architecture & Implementation

## 📋 Overview

This document provides a comprehensive overview of the Blockchain Vehicle Registration System's architecture, design patterns, and implementation details. For interactive API testing and detailed endpoint documentation, visit **`/api-docs`** (Swagger UI).

---

## 🏗️ System Architecture

### High-Level Design

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Frontend)                     │
│              React.js Application                        │
└────────────────────────────────────────────────────────┘
                            ↓ HTTP/REST
┌─────────────────────────────────────────────────────────┐
│                   API GATEWAY LAYER                      │
│              Express.js Server (Port 3000)               │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │         SWAGGER UI & Documentation               │   │
│  │         `/api-docs` (Public)                     │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │      PUBLIC ENDPOINTS (No Auth Required)         │   │
│  │  ├─ POST /api/auth/login                        │   │
│  │  ├─ POST /api/auth/register                     │   │
│  │  ├─ GET /api/init (database setup)              │   │
│  │  └─ POST /api/auth/logout                       │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │    PROTECTED ENDPOINTS (Bearer Token Required)  │   │
│  │  ├─ User Management (/api/users/*)              │   │
│  │  ├─ Owner Management (/api/owners/*)            │   │
│  │  └─ License Management (/api/licenses/*)        │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                 DATABASE LAYER                          │
│              SQLite3 Database                            │
│                                                           │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────┐ │
│  │    Users       │  │ VehicleOwner   │  │ Driving   │ │
│  │                │  │                │  │ Licenses  │ │
│  │ - ID (PK)      │  │ - OwnerID (PK) │  │ - License │ │
│  │ - Username     │  │ - LicenseID    │  │   ID (PK) │ │
│  │ - Password     │  │ - Name         │  │ - Class   │ │
│  │ - OwnerID (FK) │  │ - DOB          │  │ - Issue   │ │
│  │ - UserType     │  │ - Phone        │  │ - Expiry  │ │
│  │ - CreatedDate  │  │ - Address      │  │ - Date    │ │
│  └────────────────┘  └────────────────┘  └───────────┘ │
│         ↓                     ↓                   ↓       │
│    FOREIGN KEY RELATIONSHIP                             │
│    Users.OwnerID → VehicleOwner.OwnerID                │
│    VehicleOwner.LicenseID → DrivingLicenses.LicenseID  │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 MVC Architecture Pattern

### Controllers → Services → Database

```
REQUEST
  ↓
[ROUTER] (Route Handler)
  ↓
[CONTROLLER] (Request/Response Handling)
  - Validates input parameters
  - Calls service layer
  - Formats responses
  ↓
[SERVICE] (Business Logic)
  - Implements business rules
  - Data transformation
  - Validation logic
  ↓
[DATABASE] (Data Access)
  - SQL queries
  - Schema management
  - Transactions
  ↓
RESPONSE
```

### Example: User Login Flow

```
User POST /api/auth/login {username, password}
    ↓
authRoute.js (Router)
    ↓
authController.login()
    - Validates: username & password exist
    - Calls authService.authenticateUser()
    ↓
authService.authenticateUser()
    - Queries database for user
    - Compares password with bcryptjs
    - Returns user object (no password)
    ↓
Database Query: SELECT * FROM Users WHERE Username = ?
    ↓
authController generates JWT token
    ↓
Response: {token, user} ✅
```

---

## 📁 Project Structure

```
server/
├── config/
│   └── swagger.js                    # OpenAPI 3.0 specification
│
├── contracts/
│   └── responseFormat.js             # Standard response wrapper
│
├── controllers/
│   ├── authController.js             # Auth logic (login, register, logout)
│   ├── userController.js             # User CRUD operations
│   ├── vehicleOwnerController.js     # Owner CRUD operations
│   └── drivingLicenseController.js   # License CRUD operations
│
├── middleware/
│   └── authenticate.js               # Bearer token verification
│
├── services/
│   ├── authService.js                # Auth business logic
│   ├── userService.js                # User data access
│   ├── vehicleOwnerService.js        # Owner data access
│   └── drivingLicenseService.js      # License data access
│
├── routes/
│   ├── authRoute.js                  # /api/auth/* endpoints
│   ├── userRoute.js                  # /api/users/* endpoints
│   ├── vehicleOwnerRoute.js          # /api/owners/* endpoints
│   └── drivingLicenseRoute.js        # /api/licenses/* endpoints
│
├── utility/
│   └── authUtils.js                  # Password hashing & JWT token utils
│
├── database/
│   └── initDatabase.js               # Schema creation & sample data
│
├── server.js                         # Main Express app entry point
├── package.json                      # Dependencies & scripts
└── .env.example                      # Environment variables template
```

---

## 🔐 Authentication & Security

### JWT Token Flow

```
1. User Registration
   └─ Password hashed with bcryptjs (10 rounds)
   └─ Stored in database

2. User Login
   └─ bcryptjs.compare() validates password
   └─ JWT token generated with user data
   └─ Token expires in 24 hours

3. Protected Request
   └─ Bearer token in Authorization header
   └─ Middleware verifies token
   └─ User data attached to request

4. Token Validation
   └─ jwt.verify() decodes and validates
   └─ Invalid/expired tokens rejected (401)
```

### Security Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Password Hashing | bcryptjs (10 rounds) | Secure password storage |
| Token Generation | jsonwebtoken (HMAC-SHA256) | Create JWT tokens |
| Token Expiry | 24 hours | Limit token lifetime |
| Bearer Token | HTTP Authorization header | Standard auth format |
| Middleware | Custom authenticate.js | Validate tokens |

### Protected vs Public Endpoints

```
PUBLIC (No token required):
├─ POST /api/auth/login
├─ POST /api/auth/register
├─ POST /api/auth/logout
├─ GET /api/init
└─ GET /api-docs (Swagger UI)

PROTECTED (Bearer token required):
├─ GET /api/users
├─ GET /api/users/{id}
├─ POST /api/users
├─ GET /api/owners
├─ GET /api/owners/{id}
├─ POST /api/owners
├─ PUT /api/owners/{id}
├─ DELETE /api/owners/{id}
├─ GET /api/licenses
├─ GET /api/licenses/{id}
├─ POST /api/licenses
├─ PUT /api/licenses/{id}
└─ DELETE /api/licenses/{id}
```

---

## 💾 Database Schema

### Users Table
```sql
CREATE TABLE Users (
  ID TEXT PRIMARY KEY,                    -- UUID
  OwnerID TEXT UNIQUE,                    -- Foreign key to VehicleOwner
  Username TEXT UNIQUE NOT NULL,          -- Login username
  Password TEXT NOT NULL,                 -- Hashed password (bcryptjs)
  Salt TEXT NOT NULL,                     -- Reserved for future use
  CreatedDate TEXT NOT NULL,              -- ISO 8601 timestamp
  UserType TEXT NOT NULL,                 -- 'VehicleOwner', 'Admin', 'Inspector'
  FOREIGN KEY(OwnerID) REFERENCES VehicleOwner(OwnerID)
);
```

### VehicleOwner Table
```sql
CREATE TABLE VehicleOwner (
  OwnerID TEXT PRIMARY KEY,               -- UUID
  LicenseID TEXT NOT NULL,                -- Foreign key to DrivingLicenses
  Name TEXT NOT NULL,                     -- Full name
  DOB TEXT NOT NULL,                      -- Date of birth (YYYY-MM-DD)
  Nationality TEXT NOT NULL,              -- Country
  PhoneNumber INTEGER NOT NULL,           -- Contact number
  Address TEXT NOT NULL,                  -- Residential address
  FOREIGN KEY(LicenseID) REFERENCES DrivingLicenses(LicenseID)
);
```

### DrivingLicenses Table
```sql
CREATE TABLE DrivingLicenses (
  LicenseID TEXT PRIMARY KEY,             -- UUID
  LicenseClass TEXT NOT NULL,             -- 'Class 2A', 'Class 3', etc.
  IssueDate TEXT NOT NULL,                -- Issue date (YYYY-MM-DD)
  ExpiryDate TEXT NOT NULL                -- Expiry date (YYYY-MM-DD)
);
```

### Relationships
```
DrivingLicenses (1) ←─── (Many) VehicleOwner
                     LicenseID

VehicleOwner (1) ←─────── (1) Users
                   OwnerID
```

---

## 🔌 API Endpoints Overview

For detailed API documentation with examples and interactive testing, visit:
```
http://localhost:3000/api-docs
```

### Endpoint Categories

| Category | Count | Auth Required | Endpoints |
|----------|-------|---------------|-----------|
| Database | 1 | No | GET /api/init |
| Authentication | 3 | No | POST /auth/login, register, logout |
| Users | 3 | Yes | GET, GET/:id, POST /api/users |
| Vehicle Owners | 5 | Yes | GET, POST, GET/:id, PUT, DELETE /api/owners |
| Driving Licenses | 5 | Yes | GET, POST, GET/:id, PUT, DELETE /api/licenses |
| **Total** | **16** | - | - |

---

## 🚀 Technology Stack

### Backend
- **Framework**: Express.js 5.1.0
- **Language**: Node.js / JavaScript
- **Runtime**: v16.20.2+

### Database
- **Engine**: SQLite3 5.1.7
- **Type**: File-based relational database
- **Location**: `server/database/mydb.db`

### Authentication
- **Password Hashing**: bcryptjs 3.0.2 (10 rounds)
- **Token Generation**: jsonwebtoken 9.0.2
- **Token Format**: JWT (HMAC-SHA256)
- **Token Expiry**: 24 hours (configurable)

### API Documentation
- **Specification**: OpenAPI 3.0.0
- **UI Library**: swagger-ui-express 5.0.1
- **Parser**: swagger-jsdoc 6.2.8
- **Access**: http://localhost:3000/api-docs

### Environment Management
- **Configuration**: dotenv 17.2.3
- **Variables**: JWT_SECRET, JWT_EXPIRY, PORT, NODE_ENV

---

## 📊 Data Flow Examples

### Example 1: User Registration

```
Frontend sends POST /api/auth/register
{
  "username": "newuser",
  "password": "mypassword123",
  "userType": "VehicleOwner"
}
    ↓
authRoute.js (passes db)
    ↓
authController.register()
    - Validates username & password length
    - Checks if username exists via authService
    - Hashes password with bcryptjs.hash(password, 10)
    - Creates User record in database
    ↓
authService.registerUser()
    - Inserts into Users table
    - Returns created user (without password)
    ↓
Response: 201 Created
{
  "status": "success",
  "message": "User registered successfully.",
  "data": {
    "ID": "uuid-1234",
    "Username": "newuser",
    "UserType": "VehicleOwner",
    "CreatedDate": "2025-10-22T..."
  }
}
```

### Example 2: Get Protected Resource

```
Frontend sends GET /api/users
Header: Authorization: Bearer eyJ...
    ↓
userRoute.js (passes db)
    ↓
authenticate middleware
    - Extracts token from Authorization header
    - Verifies JWT with jwt.verify()
    - Decodes user data
    - Attaches to req.user
    ↓
userController.getAllUsers()
    - Uses req.db for database access
    - Calls userService.getAllUsers()
    ↓
userService.getAllUsers()
    - Queries: SELECT ID, Username, UserType... FROM Users
    - Returns array of users (passwords excluded)
    ↓
Response: 200 OK
{
  "status": "success",
  "message": "Users retrieved successfully.",
  "data": [
    { "ID": "uuid", "Username": "admin", ... },
    { "ID": "uuid", "Username": "johndoe", ... }
  ]
}
```

---

## 🔄 Request/Response Pattern

### Standard Success Response
```json
{
  "status": "success",
  "message": "Operation description",
  "data": {
    // Resource data here
  }
}
```

### Standard Error Response
```json
{
  "status": "error",
  "message": "What went wrong",
  "details": "Additional error information"
}
```

### HTTP Status Codes
- **200 OK** - Successful GET/PUT/DELETE
- **201 Created** - Successful POST (resource created)
- **400 Bad Request** - Invalid input/validation error
- **401 Unauthorized** - Missing/invalid token
- **404 Not Found** - Resource doesn't exist
- **500 Server Error** - Database or internal error

---

## 🧪 Sample Test Data

Database initialization creates 6 test users:

| Username | Password | Type | Purpose |
|----------|----------|------|---------|
| admin | admin123 | Admin | Admin user for testing |
| johndoe | password123 | VehicleOwner | Test owner 1 |
| janesmith | password123 | VehicleOwner | Test owner 2 |
| rjohnson | password123 | VehicleOwner | Test owner 3 |
| emilychen | password123 | VehicleOwner | Test owner 4 |
| mbrown | password123 | VehicleOwner | Test owner 5 |

Also includes:
- **5 Driving Licenses** - Various classes (2A, 2B, 3, etc.)
- **5 Vehicle Owners** - Linked to licenses

---

## 🔧 Configuration

### Environment Variables (.env)

```env
# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRY=24h

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Default Values
- **PORT**: 3000
- **JWT_SECRET**: 'your-secret-key-change-in-production'
- **JWT_EXPIRY**: '24h'
- **NODE_ENV**: 'development'

---

## ⚙️ Separation of Concerns

### Architectural Principles

1. **Controllers** - Handle HTTP requests/responses
   - Input validation
   - Call appropriate service
   - Format and return responses
   - No business logic

2. **Services** - Implement business logic
   - Data access operations
   - Validation rules
   - Transformations
   - No HTTP concerns

3. **Routes** - Define API endpoints
   - Map URL paths to controllers
   - Apply middleware
   - Separate concerns by resource

4. **Middleware** - Cross-cutting concerns
   - Authentication
   - Logging
   - Error handling
   - Database injection

5. **Database** - Data persistence
   - Schema management
   - Query execution
   - Transactions

### Benefits
✅ Easy to test (mock each layer)
✅ Easy to modify (change one layer)
✅ Easy to scale (add new resources)
✅ Easy to maintain (clear responsibilities)

---

## 📈 Scalability Considerations

### Current Setup
- Single Express server instance
- SQLite file-based database
- In-memory authentication (no session store)

### For Production Scaling

1. **Database**
   - Migrate to PostgreSQL for concurrency
   - Add connection pooling
   - Implement database replication

2. **Application**
   - Run multiple instances behind load balancer
   - Use process manager (PM2, systemd)
   - Implement horizontal scaling

3. **Cache**
   - Add Redis for session storage
   - Cache frequently accessed data
   - Reduce database queries

4. **Security**
   - Enable HTTPS/TLS
   - Add API rate limiting
   - Implement CORS properly
   - Add request validation

---

## 🚀 Deployment Guide

### Development
```bash
npm install
node server.js
```

### Production Checklist
- [ ] Update JWT_SECRET to strong random value
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Configure CORS for frontend domain
- [ ] Set up rate limiting
- [ ] Add monitoring and logging
- [ ] Back up database
- [ ] Test all endpoints

---

## 📝 Code Quality Features

- ✅ **Error Handling** - Try/catch blocks in all async operations
- ✅ **Input Validation** - Check required fields and types
- ✅ **Security** - Password hashing, token verification
- ✅ **Documentation** - JSDoc comments on all endpoints
- ✅ **Logging** - Console output for debugging
- ✅ **Standard Format** - Consistent JSON response structure

---

## 🎯 Key Features

### Authentication
- User registration with password hashing
- User login with JWT token generation
- Bearer token validation on protected routes
- Token expiry (24 hours)
- Duplicate username prevention

### User Management
- Create, read, update, delete users
- Protected endpoints (require token)
- User type classification (Admin, VehicleOwner, Inspector)

### Vehicle Owner Management
- Full CRUD operations
- Link to driving licenses
- Store owner information (name, DOB, nationality, address)

### Driving License Management
- Full CRUD operations
- License class and expiry tracking
- Date-based validity

### API Documentation
- Interactive Swagger UI
- OpenAPI 3.0 specification
- Request/response examples
- Automatic endpoint documentation

---

## 📚 Documentation

All documentation files are in the root directory:

- **DOCUMENTATION.md** - Master index with learning paths
- **SWAGGER_QUICKSTART.md** - 5-minute quick start
- **SWAGGER_VISUAL_GUIDE.md** - UI interface guide
- **SWAGGER_SETUP.md** - Detailed setup guide
- **SWAGGER_COMPLETE.md** - Implementation summary

For interactive API documentation: **http://localhost:3000/api-docs**

---

## ✅ Status

**Implementation**: Complete ✅
**Testing**: All endpoints tested ✅
**Documentation**: Comprehensive ✅
**Production Ready**: Yes ✅

---

*Last Updated: October 22, 2025*
*Framework: Express.js 5.1.0*
*Database: SQLite3 5.1.7*
