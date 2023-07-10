/**
 * Map function IDs => MVC Builders
 */
import { buildLifiswapMVC } from "./mvc-builders/lifi.js";
const SIGS_TO_MVC_BUILDERS = {
    lifiSwap: buildLifiswapMVC,
    lifiSwapReverse: buildLifiswapMVC,
};
export function buildMVC(step) {
    if (!step.function?.signature)
        throw "Cannot Build MVC If Function Does Not Exist";
    const builder = SIGS_TO_MVC_BUILDERS[step.function.signature];
    if (!builder)
        throw ("Cannot Build MVC - Builder does not exist for function: " +
            step.function.signature);
    return builder(step);
}
//# sourceMappingURL=index.js.map