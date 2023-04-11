import { PrismaClient, tokensv2 } from "@prisma/client";

const prisma = new PrismaClient();

const tokens = await prisma.tokensv2.findMany();

const neededtokens: tokensv2[] = [];

await prisma.tokensv2.updateMany({
  where: {
    logo: {
      contains: "ipfs",
    },
  },
  data: {
    logo: "https://etherscan.io/images/main/empty-token.png",
  },
});
