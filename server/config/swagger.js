const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blockchain Vehicle Registration System API',
      version: '1.0.0',
      description: 'Complete API documentation for the blockchain-based vehicle registration system with user authentication, vehicle ownership tracking, and driving license management.',
      contact: {
        name: 'API Support',
        email: 'support@vehiclereg.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local development server',
      },
      {
        url: 'https://api.vehiclereg.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Bearer token for authentication. Obtain by logging in via /api/auth/login',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            ID: {
              type: 'string',
              format: 'uuid',
              description: 'Unique user identifier',
            },
            OwnerID: {
              type: 'string',
              format: 'uuid',
              nullable: true,
              description: 'Reference to VehicleOwner if applicable',
            },
            Username: {
              type: 'string',
              description: 'Unique username',
            },
            CreatedDate: {
              type: 'string',
              format: 'date-time',
              description: 'User account creation date',
            },
            UserType: {
              type: 'string',
              enum: ['VehicleOwner', 'Admin', 'Inspector'],
              description: 'Type of user',
            },
          },
        },
        UserCredentials: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              minLength: 3,
              description: 'Username (min 3 characters)',
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Password (min 6 characters)',
            },
          },
        },
        UserRegistration: {
          type: 'object',
          required: ['username', 'password', 'userType'],
          properties: {
            username: {
              type: 'string',
              minLength: 3,
              description: 'Username (min 3 characters)',
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Password (min 6 characters)',
            },
            userType: {
              type: 'string',
              enum: ['VehicleOwner', 'Admin', 'Inspector'],
              description: 'Type of user being registered',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT Bearer token for authenticated requests',
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                },
                username: {
                  type: 'string',
                },
                userType: {
                  type: 'string',
                },
                ownerId: {
                  type: 'string',
                  format: 'uuid',
                  nullable: true,
                },
              },
            },
          },
        },
        VehicleOwner: {
          type: 'object',
          properties: {
            OwnerID: {
              type: 'string',
              format: 'uuid',
              description: 'Unique owner identifier',
            },
            LicenseID: {
              type: 'string',
              format: 'uuid',
              description: 'Reference to DrivingLicense',
            },
            Name: {
              type: 'string',
              description: 'Full name of owner',
            },
            DOB: {
              type: 'string',
              format: 'date',
              description: 'Date of birth (YYYY-MM-DD)',
            },
            Nationality: {
              type: 'string',
              description: 'Country of nationality',
            },
            PhoneNumber: {
              type: 'string',
              description: 'Contact phone number',
            },
            Address: {
              type: 'string',
              description: 'Residential address',
            },
          },
        },
        DrivingLicense: {
          type: 'object',
          properties: {
            LicenseID: {
              type: 'string',
              format: 'uuid',
              description: 'Unique license identifier',
            },
            LicenseClass: {
              type: 'string',
              enum: ['A', 'B', 'C', 'D', 'E'],
              description: 'Class of driving license',
            },
            IssueDate: {
              type: 'string',
              format: 'date',
              description: 'Date license was issued (YYYY-MM-DD)',
            },
            ExpiryDate: {
              type: 'string',
              format: 'date',
              description: 'Date license expires (YYYY-MM-DD)',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['success'],
            },
            message: {
              type: 'string',
            },
            data: {
              oneOf: [
                { $ref: '#/components/schemas/User' },
                { $ref: '#/components/schemas/LoginResponse' },
                { type: 'array', items: { $ref: '#/components/schemas/User' } },
                { type: 'null' },
              ],
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['error'],
            },
            message: {
              type: 'string',
            },
            details: {
              type: 'string',
              nullable: true,
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Database',
        description: 'Database initialization endpoints',
      },
      {
        name: 'Authentication',
        description: 'User login, registration, and authentication endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints (admin)',
      },
      {
        name: 'Vehicle Owners',
        description: 'Vehicle owner management endpoints',
      },
      {
        name: 'Driving Licenses',
        description: 'Driving license management endpoints',
      },
    ],
  },
  apis: [
    require('path').join(__dirname, '../routes/*.js'),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
