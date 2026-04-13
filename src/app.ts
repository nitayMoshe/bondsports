import express from "express";
import { prisma } from "./db";

export const app = express();
app.use(express.json());

const toAmount = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    throw new Error("Amount is required");
  }
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) {
    throw new Error("Invalid amount");
  }
  if (!Number.isInteger(numberValue)) {
    throw new Error("Amount must be an integer value");
  }
  return numberValue;
};

const getDayRange = (date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const parseDateDMY = (value: string) => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) {
    return null;
  }
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (month < 1 || month > 12) {
    return null;
  }
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
 
  return date;
};

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/accounts", async (req, res) => {
  const { personId, dailyWithdrawalLimit, accountType, initialBalance } = req.body ?? {};

  if (typeof personId !== "number" || typeof accountType !== "number") {
    return res.status(400).json({ error: "personId and accountType must be numbers" });
  }

  let limit: number;
  try {
    limit = toAmount(dailyWithdrawalLimit);
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }

  const person = await prisma.person.findUnique({ where: { personId } });
  if (!person) {
    return res.status(404).json({ error: "Person not found" });
  }

  let openingBalance = 0;
  if (initialBalance !== undefined && initialBalance !== null) {
    try {
      openingBalance = toAmount(initialBalance);
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }

  const account = await prisma.account.create({
    data: {
      personId,
      dailyWithdrawalLimit: limit,
      accountType,
      balance: openingBalance,
    },
  });

  if (openingBalance > 0) {
    await prisma.transaction.create({
      data: {
        accountId: account.accountId,
        value: openingBalance,
      },
    });
  }

  return res.status(201).json(account);
});

app.get("/accounts/:id/balance", async (req, res) => {
  const accountId = Number(req.params.id);
  if (!Number.isInteger(accountId)) {
    return res.status(400).json({ error: "Invalid account id" });
  }

  const account = await prisma.account.findUnique({ where: { accountId } });
  if (!account) {
    return res.status(404).json({ error: "Account not found" });
  }

  return res.json({ accountId, balance: account.balance });
});



app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = err instanceof Error ? err.message : "Unexpected error";
  res.status(500).json({ error: message });
});
