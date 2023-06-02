import { DBToken, address } from "@yc/yc-models";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { PrismaClient, TokenTags } from "@prisma/client";
import { json } from "body-parser";
import { ethers } from "ethers";

interface GMXToken {
  symbol: string;
  reservedAmount: `${number}`;
  liqMinPrice: `${number}`;
  address: `0x${string}`;
  poolAmount: `${number}`;
  globalShortSize: `${number}`;
  weight: `${number}`;
  redemptionAmount: `${number}`;
  liqMaxPrice: `${number}`;
  maxGlobalLongSize: `${number}`;
  bufferAmount: `${number}`;
  availableAmount: `${number}`;
  decimals: number;
  minPrice: `${number}`;
  guaranteedUsd: `${number}`;
  name: string;
  maxUsdgAmount: `${number}`;
  cumulativeFundingRate: `${number}`;
  maxPrice: `${number}`;
  usdgAmount: `${number}`;
  maxGlobalShortSize: `${number}`;
  fundingRate: `${number}`;
  updatedAt: number;
}

const allGmxTokens = await axios.get<Array<{ id: string; data: GMXToken }>>(
  "https://api.gmx.io/tokens"
);

const allYcTokens = await axios.get<{ tokens: DBToken[] }>(
  "https://api.yieldchain.io/v2/tokens"
);

const prisma = new PrismaClient();

const GMX_PROTOCOL_ID = "11e53788-0a3b-4ae0-add1-3ddf52117e08";

for (const tokenn of allGmxTokens.data) {
  const token = tokenn.data;
  const existingToken = allYcTokens.data.tokens.find(
    (_token) => _token.address == token.address && _token.chain_id == 42161
  );

  if (existingToken) {
    console.log("Gonna update...", existingToken);
    await prisma.tokensv2.update({
      where: { id: existingToken.id },
      data: {
        tags: [...(existingToken.tags || []), TokenTags.PERP_BASKET_LP],
        markets_ids: [...existingToken.markets_ids, GMX_PROTOCOL_ID],
      },
    });

    continue;
  }

  const jsonToken: DBToken = {
    id: uuid(),
    name: token.name,
    symbol: token.symbol,
    address: token.address,
    tags: [TokenTags.PERP_BASKET_LP],
    markets_ids: [GMX_PROTOCOL_ID],
    chain_id: 42161,
    logo: "https://etherscan.io/images/main/empty-token.png",
    decimals: token.decimals,
    parent_protocol: null,
  };

  console.log(jsonToken, "Gonna Create...", token);

  await prisma.tokensv2.create({
    data: jsonToken,
  });
}

// const prisma = new PrismaClient();

// const tokens = await prisma.tokensv2.findMany();

// const tokensToRemove: string[] = [];
// const tokensToUpdateChecksum: [string[], address[]] = [[], []];

// for (let i = 0; i < tokens.length; i++) {
//   const token = tokens[i];

//   if (tokens.findIndex((_token) => _token.id == token.id) != i) {
//     tokensToRemove.push(token.id);
//     continue;
//   }

//   if (token.address != ethers.getAddress(token.address)) {
//     // await prisma.tokensv2.update({
//     //   where: {
//     //     id: token.id,
//     //   },
//     //   data: {
//     //     address: ethers.getAddress(token.address),
//     //   },
//     // });
//     tokensToUpdateChecksum[0].push(token.id);
//     tokensToUpdateChecksum[1].push(ethers.getAddress(token.address) as address);
//   }
// }

// console.log(
//   "Gonna execute promises, amount of:",
//   tokensToUpdateChecksum[0].length
// );
// const promises = tokensToUpdateChecksum[0].map((tokenId, i) => {
//   const tokenAddress = tokensToUpdateChecksum[1][i];

//   return prisma.tokensv2.update({
//     where: { id: tokenId },
//     data: { address: tokenAddress },
//   });
// });

// await prisma.$transaction([
//   ...promises,
//   prisma.tokensv2.deleteMany({
//     where: {
//       id: {
//         in: tokensToRemove,
//       },
//     },
//   }),
// ]);
// console.log("Executed");
