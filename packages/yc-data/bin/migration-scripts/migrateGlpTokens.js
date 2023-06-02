import { PrismaClient, TokenTags } from "@prisma/client";
const prisma = new PrismaClient();
const tokens = await prisma.tokensv2.findMany();
const tokensTOUpdate = [];
for (const token of tokens) {
    const tokenId = token.id;
    if (token.tags.includes(TokenTags.PERP_BASKET_LP)) {
        tokensTOUpdate.push(token.id);
    }
}
await prisma.tokensv2.updateMany({
    where: {
        id: {
            in: tokensTOUpdate,
        },
    },
    data: {
        markets_ids: ["11e53788-0a3b-4ae0-add1-3ddf52117e08"],
    },
});
//# sourceMappingURL=migrateGlpTokens.js.map