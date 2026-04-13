import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.person.findFirst();
  if (existing) {
    console.log("Seed skipped: person already exists");
    return;
  }

  await prisma.person.create({
    data: {
      name: "Test Person",
      document: "DOC-0001",
      birthDate: new Date("1990-01-01"),
    },
  });

  console.log("Seed completed: created 1 person");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
