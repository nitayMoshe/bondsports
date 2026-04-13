-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Account" (
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
INSERT INTO "new_Account" ("accountId", "accountType", "activeFlag", "balance", "createDate", "dailyWithdrawalLimit", "personId") SELECT "accountId", "accountType", "activeFlag", "balance", "createDate", "dailyWithdrawalLimit", "personId" FROM "Account";
DROP TABLE "Account";
ALTER TABLE "new_Account" RENAME TO "Account";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
