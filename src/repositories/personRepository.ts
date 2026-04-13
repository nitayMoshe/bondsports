import { DbClient } from "../db";


  export const findById = (client: DbClient, personId: number) => {
    return client.person.findUnique({ where: { personId } });
  };

