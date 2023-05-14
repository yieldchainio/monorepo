/**
 * Called on the uproot tree after all iterations,
 * attempts to add swap functions for all unused inflows (scrapes)
 * @param uprootTree - The uproot tree
 * @param depositToken - The deposit token of the vault. We swap all tokens to it
 */
import { StepType, YCClassifications, YCStep } from "@yc/yc-models";
import { v4 as uuid } from "uuid";
import { buildSwapFunction } from "@yc/yc-models";
export function addScrapeSwaps(uprootTree, depositToken) {
    console.log(YCClassifications.getInstance().protocols.find((protocol) => protocol.id == "2d0a459a-7501-43a3-baba-da83801d5862"));
    const tokensToSwap = new Set();
    uprootTree.map((step) => {
        for (const token of (step.function?.inflows || []).concat(step.inflows)) {
            console.log("Adding", token.symbol, "On Scrape Swap For Function:", step.function?.signature);
            tokensToSwap.add(token);
        }
        for (const token of (step.function?.outflows || []).concat(step.outflows)) {
            console.log("Deleting", token.symbol, "On Scrape Swap For Function:", step.function?.signature);
            tokensToSwap.delete(token);
        }
    });
    const lastStep = uprootTree.leaves[uprootTree.leaves.length - 1];
    for (const [token] of Array.from(tokensToSwap.entries())) {
        if (token.id == depositToken.id)
            continue;
        const swapFunction = buildSwapFunction(token, depositToken);
        const swapStep = new YCStep({
            id: uuid(),
            tokenPercentages: [[token.id, 100]],
            inflows: [depositToken.toJSON()],
            outflows: [token.toJSON()],
            function: null,
            customArguments: [token.id, depositToken.id],
            children: [],
            data: null,
            type: StepType.STEP,
        }, YCClassifications.getInstance());
        swapStep.function = swapFunction;
        lastStep.children.push(swapStep);
        console.log("Scrape Swap", token.symbol, "=>", depositToken.symbol);
    }
}
//# sourceMappingURL=add-scrape-swaps.js.map