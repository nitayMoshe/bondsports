# BondSports Banking API (Tech Exam)

This project implements a simple REST API for account management using **TypeScript**, **Express**, **Prisma**, and **SQLite**.

## Requirements Covered
- Account creation
- Deposit
- Withdrawal (with daily withdrawal limit)
- Balance inquiry
- Account blocking
- Account statement
- Optional: statement by period via `from` and `to` query params

## Quick Start

```bash
npm install
npm run prisma:generate
npm run migrate
# If migrate fails in your environment, use:
# npm run db:init
npm run seed
npm run dev
```

Server runs on `http://localhost:3000` by default.

## Database
- SQLite file is stored at `prisma/dev.db` (configured in `.env`).
- Seed script creates **one** person record as required.
- SQL seed is also provided at `prisma/seed.sql`.

## API Endpoints

### Create Account
`POST /accounts`

Body:
```json
{
  "personId": 1,
  "dailyWithdrawalLimit": 500,
  "accountType": 1,
  "initialBalance": 1000
}
```

### Deposit
`POST /accounts/:id/deposit`

Body:
```json
{ "amount": 200 }
```

### Withdraw
`POST /accounts/:id/withdraw`

Body:
```json
{ "amount": 50 }
```

### Balance
`GET /accounts/:id/balance`

### Block Account
`PATCH /accounts/:id/block`

### Statement
`GET /accounts/:id/statement`

Optional period filter:
`GET /accounts/:id/statement?from=2026-01-01&to=2026-01-31`

## Notes
- Monetary values are stored as integer units (e.g. cents).
- All money-changing operations run inside database transactions.
