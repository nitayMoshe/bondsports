import "dotenv/config";
import { Prisma, PrismaClient } from "../generated/prisma";

export type DbClient = PrismaClient | Prisma.TransactionClient;

const prisma = new PrismaClient();

export const withClient = async <T>(fn: (client: DbClient) => Promise<T>) => fn(prisma);

export const withTransaction = async <T>(fn: (client: DbClient) => Promise<T>) =>
  prisma.$transaction(async (tx) => fn(tx));
