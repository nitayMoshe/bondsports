import "dotenv/config";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS Person (
      personId INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      document TEXT NOT NULL UNIQUE,
      birthDate DATETIME NOT NULL
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS Account (
      accountId INTEGER PRIMARY KEY AUTOINCREMENT,
      personId INTEGER NOT NULL,
      balance INTEGER NOT NULL DEFAULT 0,
      dailyWithdrawalLimit INTEGER NOT NULL,
      activeFlag BOOLEAN NOT NULL DEFAULT 1,
      accountType INTEGER NOT NULL,
      createDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      version INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (personId) REFERENCES Person(personId)
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS Transactions (
      transactionId INTEGER PRIMARY KEY AUTOINCREMENT,
      accountId INTEGER NOT NULL,
      value INTEGER NOT NULL,
      transactionDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (accountId) REFERENCES Account(accountId)
    );
  `);

  await prisma.$executeRawUnsafe(`
    INSERT OR IGNORE INTO Person (name, document, birthDate)
    VALUES ('Test Person', 'DOC-0001', '1990-01-01T00:00:00.000Z');
  `);
}

main()
  .then(() => {
    console.log("Database initialized");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
