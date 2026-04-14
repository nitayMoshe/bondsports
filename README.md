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
- npm run db:init (builds db structure + seed)
note: the 3 commands above can be run together using the "npm run setup" command I created
- npm run dev (starting server)


Server runs on `http://localhost:3000` on default.

(if you encounter "Module not found" errors - try tunning the *npm run prisma:generate* command)

also, copy the .env.example file to a new .env file and populate it with your actual data
(the DATABASE_URL value should be the relative path to your dev.db file - usually file:./dev.db)
## Playing with the server
once the server is runnning, you can change and read data in a simple way through 2 tools I implemented:
Swagger - a nice UI to run commands
Prisma studio - a UI to check the db data

Swagger will run automatically, usually on http://localhost:3000/api-docs
to get to the prisma studio, you should run the command *npx prisma studio*


## Database
- SQLite file is at `prisma/dev.db`.
- Seed script creates  one person .




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
`GET /accounts/:id/statement?from=01/01/2026&to=30/01/2026`

## Notes
- Monetary values are stored as integer units.
- All money-changing operations run inside database transactions.
_ all monetary amounts are in cents. 1000 = $10.00




