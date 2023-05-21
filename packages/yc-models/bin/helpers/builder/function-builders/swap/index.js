/**
 * Used to build a lifi swap function
 */
import { YCArgument, YCClassifications, YCFunc, } from "@yc/yc-models";
import { v4 as uuid } from "uuid";
import { Typeflags } from "@prisma/client";
import { BALANCEOF_FUNCTION_ID, SWAP_FUNCTION_ID } from "./constants.js";
export function buildSwapFunction(fromToken, toToken) {
    const context = YCClassifications.getInstance();
    // Get the swap function (LI.Fi)
    const swapJsonFunction = context.rawFunctions.find((func) => func.id == SWAP_FUNCTION_ID);
    // Assert that it must exist
    if (!swapJsonFunction)
        throw "Cannot Complete Swap Config - Swap Function Is Non-Existant.";
    const swapFunction = new YCFunc(swapJsonFunction, YCClassifications.getInstance());
    console.log("Swap Json Function");
    // We need to create the amount getter
    const fromTokenDBArgument = {
        id: uuid(),
        name: `${fromToken}Balance`,
        solidity_type: "address",
        value: fromToken.address,
        custom: false,
        typeflag: Typeflags.VALUE_VAR_FLAG,
        ret_typeflag: Typeflags.VALUE_VAR_FLAG,
        relating_token: null,
        overridden_custom_values: [],
    };
    const fromTokenDynamicBalanceof = {
        id: uuid(),
        name: "fromAmount",
        relating_token: fromToken.id,
        solidity_type: "function",
        typeflag: Typeflags.STATICCALL_COMMAND_FLAG,
        ret_typeflag: Typeflags.VALUE_VAR_FLAG,
        value: BALANCEOF_FUNCTION_ID,
        overridden_custom_values: [],
        custom: false,
    };
    const tokenBalanceOfGetter = new YCArgument(fromTokenDynamicBalanceof, YCClassifications.getInstance());
    tokenBalanceOfGetter.value.arguments[0] = new YCArgument(fromTokenDBArgument, YCClassifications.getInstance());
    // Insert our new balanceOf getter to the getInvestmentAmount args
    swapFunction.arguments[2].value.arguments[0] =
        tokenBalanceOfGetter;
    // Set the relating token on it
    swapFunction.arguments[2].relatingToken = fromToken;
    return swapFunction;
}
//# sourceMappingURL=index.js.map