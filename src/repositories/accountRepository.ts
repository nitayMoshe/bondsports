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
      version: number;
    }
  )  => {
    return client.account.create({ data });
  };

  
  export const updateBalance = (client: DbClient, accountId: number, balance: number, version: number) => {
    return client.account.update({ where: { accountId, version: version }, data: { balance, version: {increment: 1} } });
  };


  export const block = (client: DbClient, accountId: number, version: number) => {
    return client.account.update({ where: { accountId, version }, data: { activeFlag: false, version: {increment: 1} } });
  };


    export const unblock = (client: DbClient, accountId: number, version: number) => {
    return client.account.update({ where: { accountId, version }, data: { activeFlag: true, version: {increment: 1}} });
  };

