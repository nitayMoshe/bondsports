import { DbClient } from "../db";

export const personRepository = {
  findById(client: DbClient, personId: number) {
    return client.person.findUnique({ where: { personId } });
  },
};
