-- CreateTable
CREATE TABLE "Person" (
    "personId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Account" (
    "accountId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "personId" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "dailyWithdrawalLimit" INTEGER NOT NULL,
    "activeFlag" BOOLEAN NOT NULL DEFAULT true,
    "accountType" INTEGER NOT NULL,
    "createDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "Account_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("personId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transactions" (
    "transactionId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accountId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "transactionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("accountId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_document_key" ON "Person"("document");
