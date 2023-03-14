import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
let networks = await client.networks.findMany({});
console.log("Networks before ser!!", networks);
await client.networks.deleteMany({});
networks = await client.networks.findMany({});
console.log("Networks after ser!!", networks);
//# sourceMappingURL=networks.js.map