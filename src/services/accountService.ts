import { withClient, withTransaction } from "../db";
import * as accountRepository  from "../repositories/accountRepository";
import * as personRepository  from "../repositories/personRepository";
import * as transactionRepository  from "../repositories/transactionRepository";

export type CreateAccountInput = {
  personId: number;
  dailyWithdrawalLimit: number;
  accountType: number;
  initialBalance?: number;
};

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
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
};

export const parseAmount = toAmount;
export const parseDate = parseDateDMY;

export const createAccount = async (input: CreateAccountInput) =>
  withTransaction(async (client) => {
    const person = await personRepository.findById(client, input.personId);
    if (!person) {
      throw new Error("Person not found");
    }

    const account = await accountRepository.create(client, {
      personId: input.personId,
      dailyWithdrawalLimit: input.dailyWithdrawalLimit,
      accountType: input.accountType,
      balance: input.initialBalance ?? 0,
      version: 1
    });

    if ((input.initialBalance ?? 0) > 0) {
      await transactionRepository.create(client, {
        accountId: account.accountId,
        value: input.initialBalance ?? 0,
      });
    }

    return account;
  });

export const getBalance = async (accountId: number) =>
  withClient(async (client) => {
    const account = await accountRepository.findById(client, accountId);
    if (!account) {
      throw new Error("Account not found");
    }
    return account.balance;
  });



export const deposit = async (accountId: number, amount: number) =>
  withTransaction(async (client) => {

    const account = await accountRepository.findById(client, accountId);
    if (!account) throw new Error("Account not found");
    if (!account.activeFlag) throw new Error("Account is blocked");

    const newBalance = account.balance + amount;

    try {
          const updated = await accountRepository.updateBalance(client, accountId, newBalance, account.version);

    await transactionRepository.create(client, { accountId, value: amount });

    return updated;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new Error("Conflict: The account was updated by another request. Please try again.");
      }
      throw error;
    }

  });

export const withdraw = async (accountId: number, amount: number) =>

  withTransaction(async (client) => {

    const account = await accountRepository.findById(client, accountId);
    if (!account) throw new Error("Account not found");
    if (!account.activeFlag) throw new Error("Account is blocked");
    if (account.balance < amount) throw new Error("Insufficient funds");

    const { start, end } = getDayRange(new Date());
    const sum = await transactionRepository.sumWithdrawalsForDay(client, accountId, start, end);

    const withdrawnToday = sum._sum.value ? Math.abs(sum._sum.value) : 0;
    const proposedTotal = withdrawnToday + amount;
    if (proposedTotal > account.dailyWithdrawalLimit) {
      throw new Error("Daily withdrawal limit exceeded");
    }

    const newBalance = account.balance - amount;

    try {
        const updated = await accountRepository.updateBalance(client, accountId, newBalance, account.version);

    await transactionRepository.create(client, { accountId, value: -amount });

    return updated;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new Error("Conflict: The account was updated by another request. Please try again.");
      }
      throw error;
    }
  
  });

export const blockAccount = async (accountId: number) =>
  withTransaction( async (client) => {
    const account = await accountRepository.findById(client, accountId);
    if (!account) {
      throw new Error("Account not found");
    }

    try {
      return await accountRepository.block(client, accountId, account.version);

    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new Error("Conflict: The account status was modified by another process. Please try again.");
      }
      throw error;
    }
}  );
  


export const getStatement = async (accountId: number, from?: string, to?: string) =>

  withClient(async (client) => {
    const account = await accountRepository.findById(client, accountId);
    if (!account) throw new Error("Account not found");

    let range: { gte?: Date; lte?: Date } | undefined;
    if (from || to) {
      range = {};
      if (from) {
        const fromDate = parseDateDMY(from);
        if (!fromDate) throw new Error("Invalid from date (use DD/MM/YYYY)");
        range.gte = fromDate;
      }
      if (to) {
        const toDate = parseDateDMY(to);
        if (!toDate) throw new Error("Invalid to date (use DD/MM/YYYY)");
        range.lte = toDate;
      }
    }

    const transactions = await transactionRepository.findByAccount(client, accountId, range);
    return { accountId, transactions };
  });


  

  export const unblockAccount = async (accountId: number) =>
 withTransaction( async (client) => {
    const account = await accountRepository.findById(client, accountId);
    if (!account) {
      throw new Error("Account not found");
    }

    try {
      return await accountRepository.unblock(client, accountId, account.version);

    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new Error("Conflict: The account status was modified by another process. Please try again.");
      }
      throw error;
    }
} );
