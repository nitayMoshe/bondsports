import { DbClient } from "../db";


  export const create = (client: DbClient, data: { accountId: number; value: number }) => {
    return client.transaction.create({ data });
  };


  export const findByAccount = (client: DbClient, accountId: number, range?: { gte?: Date; lte?: Date }) => {
    return client.transaction.findMany({
      where: {
        accountId,
        ...(range ? { transactionDate: range } : {}),
      },
      orderBy: { transactionDate: "desc" },
    });
  };


  export const sumWithdrawalsForDay = (client: DbClient, accountId: number, start: Date, end: Date) => {
    return client.transaction.aggregate({
      where: {
        accountId,
        transactionDate: { gte: start, lte: end },
        value: { lt: 0 },
      },
      _sum: { value: true },
    });
  };

