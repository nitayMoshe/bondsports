import { DbClient } from "../db";

export const transactionRepository = {
  create(client: DbClient, data: { accountId: number; value: number }) {
    return client.transaction.create({ data });
  },
  findByAccount(client: DbClient, accountId: number, range?: { gte?: Date; lte?: Date }) {
    return client.transaction.findMany({
      where: {
        accountId,
        ...(range ? { transactionDate: range } : {}),
      },
      orderBy: { transactionDate: "desc" },
    });
  },
  sumWithdrawalsForDay(client: DbClient, accountId: number, start: Date, end: Date) {
    return client.transaction.aggregate({
      where: {
        accountId,
        transactionDate: { gte: start, lte: end },
        value: { lt: 0 },
      },
      _sum: { value: true },
    });
  },
};
