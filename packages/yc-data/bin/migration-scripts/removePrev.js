import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const protocols = await prisma.protocolsv2.findMany();
const addresses = await prisma.addressesv2.findMany();
const functions = await prisma.functionsv2.findMany();
for (const address of addresses) {
    if (address.protocol_id == "11e53788-0a3b-4ae0-add1-3ddf52117e08" ||
        address.protocol_id == "2d0a459a-7501-43a3-baba-da83801d5862" ||
        address.protocol_id == "48c504f0-cf0e-4dc1-ac61-2f7726de0f1b" ||
        address.protocol_id == "9d03c73b-b7e0-4185-9c14-0d16bd18833b")
        continue;
    await prisma.addressesv2.update({
        where: {
            id: address.id,
        },
        data: {
            functions_ids: [],
        },
    });
    await prisma.addressesv2.delete({
        where: {
            id: address.id,
        },
    });
}
//# sourceMappingURL=removePrev.js.map