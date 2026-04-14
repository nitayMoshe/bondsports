import { Request, Response } from "express";
import * as accountService from "../services/accountService";
import { ValidationError } from "../utils/AppError";

export const health = (_req: Request, res: Response) => {
  res.json({ status: "ok" });
};

export const createAccount = async (req: Request, res: Response) => {
  const { personId, dailyWithdrawalLimit, accountType, initialBalance } = req.body ?? {};

  if (typeof personId !== "number" || typeof accountType !== "number") {
    throw new ValidationError("personId and accountType must be numbers");
  }

  // If parseAmount fails, it now throws a ValidationError which goes straight to the global handler
  const limit = accountService.parseAmount(dailyWithdrawalLimit);

  let openingBalance = 0;
  if (initialBalance !== undefined && initialBalance !== null) {
    openingBalance = accountService.parseAmount(initialBalance);
  }

  const account = await accountService.createAccount({
    personId,
    dailyWithdrawalLimit: limit,
    accountType,
    initialBalance: openingBalance,
  });
  
  res.status(201).json(account);
};

export const getBalance = async (req: Request, res: Response) => {
  const accountId = Number(req.params.id);
  
  if (!Number.isInteger(accountId)) {
    throw new ValidationError("Invalid account id");
  }

  const balance = await accountService.getBalance(accountId);
  res.json({ accountId, balance });
};

export const deposit = async (req: Request, res: Response) => {
  const accountId = Number(req.params.id);
  
  if (!Number.isInteger(accountId)) {
    throw new ValidationError("Invalid account id");
  }

  const amount = accountService.parseAmount(req.body?.amount);

  if (amount <= 0) {
    throw new ValidationError("Deposit amount must be greater than 0");
  }

  const result = await accountService.deposit(accountId, amount);
  res.json(result);
};

export const withdraw = async (req: Request, res: Response) => {
  const accountId = Number(req.params.id);
  
  if (!Number.isInteger(accountId)) {
    throw new ValidationError("Invalid account id");
  }

  const amount = accountService.parseAmount(req.body?.amount);

  if (amount <= 0) {
    throw new ValidationError("Withdrawal amount must be greater than 0");
  }

  const result = await accountService.withdraw(accountId, amount);
  res.json(result);
};

export const block = async (req: Request, res: Response) => {
  const accountId = Number(req.params.id);
  
  if (!Number.isInteger(accountId)) {
    throw new ValidationError("Invalid account id");
  }

  const account = await accountService.blockAccount(accountId);
  res.json(account);
};

export const unblock = async (req: Request, res: Response) => {
  const accountId = Number(req.params.id);
  
  if (!Number.isInteger(accountId)) {
    throw new ValidationError("Invalid account id");
  }

  const account = await accountService.unblockAccount(accountId);
  res.json(account);
};

export const statement = async (req: Request, res: Response) => {
  const accountId = Number(req.params.id);
  
  if (!Number.isInteger(accountId)) {
    throw new ValidationError("Invalid account id");
  }

  const from = req.query.from ? String(req.query.from) : undefined;
  const to = req.query.to ? String(req.query.to) : undefined;

  const result = await accountService.getStatement(accountId, from, to);
  res.json(result);
};