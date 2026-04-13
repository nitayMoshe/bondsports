import { Request, Response } from "express";
import * as  accountService from "../services/accountService";


  export const health = (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  };
  export const  createAccount = async (req: Request, res: Response) => {
    const { personId, dailyWithdrawalLimit, accountType, initialBalance } = req.body ?? {};

    if (typeof personId !== "number" || typeof accountType !== "number") {
      return res.status(400).json({ error: "personId and accountType must be numbers" });
    }

    let limit: number;
    try {
      limit = accountService.parseAmount(dailyWithdrawalLimit);
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }

    let openingBalance = 0;
    if (initialBalance !== undefined && initialBalance !== null) {
      try {
        openingBalance = accountService.parseAmount(initialBalance);
      } catch (err) {
        return res.status(400).json({ error: (err as Error).message });
      }
    }

    try {
      const account = await accountService.createAccount({
        personId,
        dailyWithdrawalLimit: limit,
        accountType,
        initialBalance: openingBalance,
      });
      return res.status(201).json(account);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      const status = message === "Person not found" ? 404 : 400;
      return res.status(status).json({ error: message });
    }
  };




  export const  getBalance = async (req: Request, res: Response) => {
    const accountId = Number(req.params.id);
    if (!Number.isInteger(accountId)) {
      return res.status(400).json({ error: "Invalid account id" });
    }

    try {
      const balance = await accountService.getBalance(accountId);
      return res.json({ accountId, balance });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      const status = message === "Account not found" ? 404 : 400;
      return res.status(status).json({ error: message });
    }
  };


  export const deposit = async (req: Request, res: Response) => {
    const accountId = Number(req.params.id);
    if (!Number.isInteger(accountId)) {
      return res.status(400).json({ error: "Invalid account id" });
    }

    let amount: number;
    try {
      amount = accountService.parseAmount(req.body?.amount);
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: "Deposit amount must be greater than 0" });
    }

    try {
      const result = await accountService.deposit(accountId, amount);
      return res.json(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      const status = message === "Account not found" ? 404 : 400;
      return res.status(status).json({ error: message });
    }
  };



  export const withdraw = async (req: Request, res: Response) => {
    const accountId = Number(req.params.id);
    if (!Number.isInteger(accountId)) {
      return res.status(400).json({ error: "Invalid account id" });
    }

    let amount: number;
    try {
      amount = accountService.parseAmount(req.body?.amount);
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: "Withdrawal amount must be greater than 0" });
    }

    try {
      const result = await accountService.withdraw(accountId, amount);
      return res.json(result);

    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      const status = message === "Account not found" ? 404 : 400;
      return res.status(status).json({ error: message });
    }
  };



  export const block = async (req: Request, res: Response) => {
    const accountId = Number(req.params.id);
    if (!Number.isInteger(accountId)) {
      return res.status(400).json({ error: "Invalid account id" });
    }

    try {
      const account = await accountService.blockAccount(accountId);
      return res.json(account);
    } catch {
      return res.status(404).json({ error: "Account not found" });
    }
  };




    export const unblock = async (req: Request, res: Response) => {
    const accountId = Number(req.params.id);
    if (!Number.isInteger(accountId)) {
      return res.status(400).json({ error: "Invalid account id" });
    }

    try {
      const account = await accountService.unblockAccount(accountId);
      return res.json(account);
    } catch {
      return res.status(404).json({ error: "Account not found" });
    }
  };


  export const statement = async  (req: Request, res: Response) => {
    const accountId = Number(req.params.id);
    if (!Number.isInteger(accountId)) {
      return res.status(400).json({ error: "Invalid account id" });
    }

    const from = req.query.from ? String(req.query.from) : undefined;
    const to = req.query.to ? String(req.query.to) : undefined;

    try {
      const result = await accountService.getStatement(accountId, from, to);
      return res.json(result);

    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      const status = message === "Account not found" ? 404 : 400;
      return res.status(status).json({ error: message });
    }
  }

