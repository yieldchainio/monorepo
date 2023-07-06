import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

console.log(
  await prisma.tokensv2.findMany({
    where: {
      address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
    },
  })
);
