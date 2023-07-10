/**
 * MVC builders for LI.FI actions
 */
import { YCClassifications } from "../../../../core/index.js";
import { EncodingContext } from "../../../../types/yc.js";
export function buildLifiswapMVC(step) {
    const context = YCClassifications.getInstance();
    const mvcFunc = context.getFunction("LIFISWAP_MVC");
    if (!mvcFunc)
        throw "[buildLifiswapMVC]: MVC Func not found";
    // It has no args, is prepended at runtime
    return mvcFunc.encodeYCCommand(step.toJSON(), EncodingContext.TREE, step.customArguments);
}
//# sourceMappingURL=lifi.js.map