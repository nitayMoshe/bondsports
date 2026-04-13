import { DbClient } from "../db";


  export const findById = (client: DbClient, accountId: number) => {
    return client.account.findUnique({ where: { accountId } });
  };

  export const create = (
    client: DbClient,
    data: {
      personId: number;
      dailyWithdrawalLimit: number;
      accountType: number;
      balance: number;
    }
  )  => {
    return client.account.create({ data });
  };

  
  export const updateBalance = (client: DbClient, accountId: number, balance: number) => {
    return client.account.update({ where: { accountId }, data: { balance } });
  };


  export const block = (client: DbClient, accountId: number) => {
    return client.account.update({ where: { accountId }, data: { activeFlag: false } });
  };


    export const unblock = (client: DbClient, accountId: number) => {
    return client.account.update({ where: { accountId }, data: { activeFlag: true } });
  };

