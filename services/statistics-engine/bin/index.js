import dotenv from "dotenv";
dotenv.config();
import { YCClassifications } from "@yc/yc-models";
const context = new YCClassifications();
if (!context.initiallized)
    await context.initiallize();
const strategies = context.strategies;
for (const strategy of strategies) {
    // const startingShares = await queryVaultShares(strategy)
}
//# sourceMappingURL=index.js.map