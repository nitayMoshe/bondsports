import { DbClient } from "../db";

export const accountRepository = {
  findById(client: DbClient, accountId: number) {
    return client.account.findUnique({ where: { accountId } });
  },
  create(
    client: DbClient,
    data: {
      personId: number;
      dailyWithdrawalLimit: number;
      accountType: number;
      balance: number;
    }
  ) {
    return client.account.create({ data });
  },
  updateBalance(client: DbClient, accountId: number, balance: number) {
    return client.account.update({ where: { accountId }, data: { balance } });
  },
  block(client: DbClient, accountId: number) {
    return client.account.update({ where: { accountId }, data: { activeFlag: false } });
  },
};
