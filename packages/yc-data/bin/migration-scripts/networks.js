import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
let networksv2 = await client.networksv2.findMany();
let networks = await client.networks.findMany();
console.log("Networks before ser!!", networksv2);
for (const network of networks) {
    await client.networksv2.create({
        data: {
            id: network.chain_id,
            name: network.name || "",
            logo: network.logo || "",
            block_explorer: network.block_explorer || "",
            json_rpc: network.json_rpc || "",
            diamond_address: network.diamond_address || "",
        },
    });
}
console.log("Networks after ser!!", await client.networksv2.findMany());
//# sourceMappingURL=networks.js.map