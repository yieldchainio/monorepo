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
    const tokensToSwap = new Set();
    uprootTree.map((step) => {
        for (const token of (step.function?.inflows || []).concat(step.inflows)) {
            tokensToSwap.add(token);
        }
        for (const token of (step.function?.outflows || []).concat(step.outflows)) {
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
    }
}
//# sourceMappingURL=add-scrape-swaps.js.map