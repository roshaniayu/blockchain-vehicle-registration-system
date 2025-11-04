# Blockchain Vehicle Registration System

This repository contains the source code for the _Vehicle Registration System Using Smart Contracts and Blockchain Technology_ that created by **Team 4**. This course project is part of the IN6236 Blockchain System Software Engineering, Wee Kim Wee School of Communication and Information, Nanyang Technological University, 2025.

Team 4 members:
1. Balakrishnan Thoshinny - G2505848D
2. Hein Thet Naung - G2505857E
3. Irfan Rahmanindra - G2504917A
4. Roshani Ayu Pranasti - G2504973A

## Application Definition

The Blockchain Vehicle Registration System is a decentralized application (dApp) designed to modernize and secure the process of vehicle registration and management. By leveraging blockchain technology, this system creates a transparent, immutable, and tamper-proof record of vehicles, owners, and related information. This project aims to streamline interactions between vehicle owners, government authorities, and insurance providers, reducing fraud and administrative overhead.

The system is composed of three main components:
-   **Smart Contracts:** A set of Solidity smart contracts deployed on an Ethereum-based blockchain to manage all data and business logic in a decentralized manner.
-   **Backend Server:** A Node.js and Express.js application that serves as a bridge between the frontend and the blockchain, and also manages some off-chain data.
-   **Frontend Client:** A Next.js and React single-page application that provides a user-friendly interface for interacting with the system.

## Application Objectives

The primary objectives of this project are:
-   To provide a secure and transparent platform for vehicle registration and ownership transfer.
-   To create a decentralized database of vehicle information, including registration details, ownership history, and insurance records.
-   To enable law enforcement to issue and manage traffic violation tickets digitally.
-   To allow insurance companies to manage vehicle insurance policies and claims efficiently.
-   To offer a marketplace for users to buy and sell vehicles securely.
-   To ensure data integrity and prevent fraud through the use of blockchain technology.

## Tech Stack

The project is built using the following technologies:

### Blockchain
-   **Solidity:** For writing smart contracts.
-   **Truffle Suite:** For smart contract compilation, deployment, and testing.
-   **Ganache:** For creating a local Ethereum blockchain for development.
-   **OpenZeppelin Contracts:** For secure and reusable smart contract components.

### Backend
-   **Node.js:** As the JavaScript runtime environment.
-   **Express.js:** As the web application framework.
-   **SQLite:** As the relational database for off-chain data storage.
-   **JWT (JSON Web Tokens):** For user authentication and authorization.
-   **Swagger:** For API documentation.

### Frontend
-   **Next.js:** As the React framework for server-side rendering and static site generation.
-   **React:** For building the user interface.
-   **TypeScript:** For static typing and improved developer experience.
-   **Tailwind CSS & Flowbite:** For UI styling and components.
-   **Web3.js:** For interacting with the Ethereum blockchain.
-   **TanStack Query:** For managing server state in React.

## Installation

To set up the project locally, follow these steps:

### 1. Prerequisites
-   [Node.js](https://nodejs.org/) (v16 and v24.10.0)
-   [Ganache](https://trufflesuite.com/ganache/) or a local Ethereum node.
-   [Truffle](https://trufflesuite.com/truffle/) (`npm install -g truffle`)
-   [MetaMask](https://metamask.io/) browser extension.

### 2. Clone the repository
```bash
git clone https://github.com/roshaniayu/blockchain-vehicle-registration-system.git
cd blockchain-vehicle-registration-system
```

### 3. Set up the Blockchain
```bash
cd blockchain
nvm use
npm install
```
-   Open Ganache and start a new workspace.
-   Update `truffle-config.js` with your Ganache network details if they are different from the default (`host: "127.0.0.1"`, `from: "0x6A2b6ED730881c41b72328d10903c00009EE53E2"`).
-   Deploy the smart contracts:
    ```bash
    truffle migrate --reset
    ```
-   Copy the generated build/contracts directory to the `client/src`.

### 4. Set up the Backend Server
```bash
cd ../server
nvm use
npm install
```
-   Create a `.env` file from the `.env.example` and fill in the required environment variables.
-   Start the server:
    ```bash
    npm start
    ```

### 5. Set up the Frontend Client
```bash
cd ../client
nvm use
npm install
```
-   Create a `.env` file from the `.env.example` and fill in the required environment variables.
-   Start the client:
    ```bash
    npm run dev
    ```

## Build

To build the applications for production:

### Backend
The server does not require a build step. You can run it in production using a process manager like PM2.

### Frontend
```bash
cd client
npm run build
```
This will create an optimized production build in the `out` directory.

## Environment Links

Once all the services are running, you can access them at the following default URLs:
-   **Frontend Application:** [http://localhost:3000](http://localhost:3000)
-   **Backend API:** [http://localhost:9000](http://localhost:9000)
-   **Database initalization** [http://localhost:9000/api/init](http://localhost:9000/api/init)
-   **API Documentation (Swagger):** [http://localhost:9000/api-docs](http://localhost:9000/api-docs)
