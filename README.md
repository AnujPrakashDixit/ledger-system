# Ledger System

A **Bank Ledger System** built with Node.js and Express that manages user authentication, accounts, and financial transactions.

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

---

## About

The Ledger System is a backend REST API that simulates core banking ledger functionality — enabling users to register, authenticate, create bank accounts, and record financial transactions securely.

---

## Features

- User registration, login, and logout with cookie-based auth
- Create and manage bank accounts per user
- View all accounts belonging to a user
- Check account balance
- Record financial transactions between accounts
- System-level endpoint for seeding initial funds
- Route protection via auth middleware

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework & routing |
| **cookie-parser** | Cookie-based authentication support |
| **JavaScript** | Core language |

---

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/AnujPrakashDixit/ledger-system.git

# Navigate into the project directory
cd ledger-system

# Install dependencies
npm install
```

### Running the Server

```bash
node server.js
```

The server will start on `http://localhost:3000` (or the configured port).

---

## Project Structure

```
ledger-system/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── account.controller.js
│   │   └── transaction.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── account.routes.js
│   │   └── transaction.routes.js
│   └── middlewares/
│       └── auth.middleware.js
├── server.js
├── package.json
├── jsconfig.json
└── .gitignore
```

---

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `POST` | `/api/auth/register` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login and receive auth cookie |
| `POST` | `/api/auth/logout` | ❌ | Logout and clear auth cookie |

---

### Accounts — `/api/accounts`

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `POST` | `/api/accounts` | ✅ | Create a new bank account |
| `GET` | `/api/accounts` | ✅ | Get all accounts for the logged-in user |
| `GET` | `/api/accounts/balance/:accountId` | ✅ | Get balance of a specific account |

---

### Transactions — `/api/transactions`

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `POST` | `/api/transactions` | ✅ User | Create a new transaction |
| `POST` | `/api/transactions/system/initial-funds` | ✅ System | Seed initial funds into an account (system only) |

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## Author

**Anuj Prakash Dixit**  
[GitHub](https://github.com/AnujPrakashDixit)

---

## License

This project is open source. Feel free to use and modify it.
