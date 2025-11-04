# Blockchain Vehicle Registration System - Backend

This is the backend server for the Blockchain Vehicle Registration System. It provides a RESTful API for the frontend client to interact with the application's off-chain data and business logic.

## Tech Stack

-   **Node.js:** As the JavaScript runtime environment.
-   **Express.js:** As the web application framework.
-   **SQLite:** As the relational database for off-chain data storage.
-   **JWT (JSON Web Tokens):** For user authentication and authorization.
-   **Swagger:** For API documentation.
-   **bcryptjs:** For password hashing.
-   **CORS:** For enabling cross-origin resource sharing.

## Getting Started

To get the server running locally, follow these steps:

1.  **Prerequisites**
    -   [Node.js](https://nodejs.org/) (v24.10.0) or run
    ```bash
    nvs use
    ```

2.  **Installation**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in the `server` directory by copying the `.env.example` file. Update the variables as needed. A default `JWT_SECRET` is provided, but it is recommended to change it for production.

4.  **Running the Server**
    ```bash
    npm start
    ```

The server will start on the port specified in your `.env` file (default is 9000).

## Scripts

-   `npm start`: Starts the server using `node server.js`.
-   `npm test`: (Not yet implemented) Will run the test suite.

## Init Database

Once the server is running, you can initialize the table at [http://localhost:9000/api/init](http://localhost:9000/api/init).

## API Documentation

Once the server is running, you can access the interactive API documentation (Swagger UI) at [http://localhost:9000/api-docs](http://localhost:9000/api-docs).

This documentation provides detailed information about all the available API endpoints, including request parameters, response formats, and example usage.

## Project Structure

The server follows a Model-View-Controller (MVC) like architecture, with the following directory structure:

-   `controllers/`: Handles incoming requests, validates data, and sends responses.
-   `services/`: Contains the business logic of the application.
-   `routes/`: Defines the API endpoints and maps them to controllers.
-   `database/`: Manages the database connection and initialization.
-   `middleware/`: Contains middleware functions, such as authentication.
-   `utility/`: Provides utility functions, such as password hashing and JWT generation.