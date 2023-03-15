import { PrismaClient } from "@prisma/client";
// @ts-ignore
import toChecksumAddress from "to-checksum-address";

const client = new PrismaClient();

const strategies = await client.strategies.findMany();

const newStrategies = await client.strategiesv2.findMany();

for (const strategy of newStrategies) {
  console.log(strategy.steps);
}
