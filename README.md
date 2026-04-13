# BondSports Bank API

This project implements a REST API for account management

## Base Requirements
- Account creation
- Deposit
- Withdrawal 
- Balance quiry
- Account blocking
- Account statement

## Bonus Requirements
- statement by period
- execution manual
- good documentation
- creating auto tests
- Implementating  points of failure and resilience
- Elaborating the design of the project architecture.



  ## Quick Start
once the project is downloaded, all you need to do is run these commanfs on the terminal:

- npm install (install dependencies)
- npm run prisma:generate (auto generate the prisma doc)
- npm run migrate (builds db structure based on the schema)
# If migrate fails u can use:
# npm run db:init
- npm run seed (populates the db with 1 person)
- npm run dev (starting server)


Server runs on `http://localhost:3000` on default.

## Database
- SQLite file is at `prisma/dev.db`.
- Seed script creates  one person .
- SQL seed is at `prisma/seed.sql`.




## API Endpoints examples

### Create Account
`POST /accounts`

Body:
{
  "personId": 1,
  "dailyWithdrawalLimit": 500,
  "accountType": 1,
  "initialBalance": 1000
}


### Deposit to acc
`POST /accounts/:id/deposit`

Body:
{ "amount": 200 }


### Withdraw from acc
`POST /accounts/:id/withdraw`

Body:

{ "amount": 50 }
\


### Get Balance
`GET /accounts/:id/balance`

### Block an Account
`PATCH /accounts/:id/block`

### Get Acc Statement
`GET /accounts/:id/statement`

period filter (optional):
`GET /accounts/:id/statement?from=2026-01-01&to=2026-01-31`

## Notes
- Monetary values are stored as integer units.
- All money-changing operations run inside database transactions.





