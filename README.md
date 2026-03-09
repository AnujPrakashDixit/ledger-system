# Ledger System

A **Bank Ledger System** built with Node.js that manages financial transactions and account balances.

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

The Ledger System is a backend application that simulates core banking ledger functionality — enabling users to create accounts, record transactions (credits and debits), and query account balances with full transaction history.

---

## Features

- Create and manage bank accounts
- Record debit and credit transactions
- View current account balance
- Fetch transaction history per account
- RESTful API design

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework & routing |
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
# Start the server
node server.js
```

The server will start on `http://localhost:3000` (or the configured port).

---

## Project Structure

```
ledger-system/
├── src/                  # Core application logic
├── server.js             # Entry point — initializes and starts the server
├── package.json          # Project metadata and dependencies
├── jsconfig.json         # JavaScript configuration
└── .gitignore
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/accounts` | Create a new account |
| `GET` | `/accounts/:id` | Get account details |
| `POST` | `/transactions` | Record a transaction (debit/credit) |
| `GET` | `/accounts/:id/transactions` | Get transaction history for an account |
| `GET` | `/accounts/:id/balance` | Get current balance |

> **Note:** Update this section with the actual routes defined in `src/`.

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
