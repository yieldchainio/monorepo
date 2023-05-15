import { AbiCoder, ethers } from "ethers";
import { YCFunc, } from "../../../../core/index.js";
import { EncodingContext, } from "../../../../types/index.js";
import { TypeflagValues } from "../../../../constants.js";
import { remove0xPrefix } from "../../remove-0x-prefix.js";
const WITHDRAW_SHARES_MEM_LOCATION = "0x2c0";
const WITHDRAW_SHARES_RETREIVER_ARG_ID = "000";
/**
 * Encode a getInvestmentAmount() YC Command
 */
export const encodeGetInvestmentAmount = (step, context, argument) => {
    // YCArgument value must be function
    if (!(argument.value instanceof YCFunc))
        throw "Cannot Encode Get Investment Amount - Not A Function";
    // Must have a relating token
    if (!argument.relatingToken)
        throw "Cannot Encode Get Investment Amount - No Relating Token";
    // @notice
    // We first check to see if the context is UPROOT. If it is,
    // Then we actually add another function call instead of the set token percentage,
    // which is used to MLOAD the shares % the user is trying to withdraw
    if (context == EncodingContext.UPROOT) {
        // Get the withdraw shares retreiver function
        const withdrawalFuncStruct = {
            target_address: ethers.ZeroAddress,
            // The location in memory of the withdraw shares variable
            args: [
                AbiCoder.defaultAbiCoder().encode(["uint256"], [WITHDRAW_SHARES_MEM_LOCATION]),
            ],
            signature: "",
        };
        // Encode the withdraw shares loader manually
        return `0x${(TypeflagValues.INTERNAL_LOAD_FLAG,
            TypeflagValues.VALUE_VAR_FLAG,
            remove0xPrefix(AbiCoder.defaultAbiCoder().encode([YCFunc.FunctionCallTuple], [withdrawalFuncStruct])))}`;
    }
    // Get the token percentage from the step, assert that it must exist also
    const tokenPercentage = new Map(step.tokenPercentages).get(argument.relatingToken.id);
    if (!tokenPercentage)
        throw "Cannot Encode Get Investment Amount - No Token Percentage Set";
    // Encode hardcoded divisor and return
    const tokenPercentageAsCommand = `0x${(TypeflagValues["VALUE_VAR_FLAG"],
        TypeflagValues["VALUE_VAR_FLAG"],
        remove0xPrefix(AbiCoder.defaultAbiCoder().encode(["uint256"], 
        // We transform it into a "divisor" and multiply by 100 (safe maths)
        [(100 / tokenPercentage) * 100])))}`;
    const fullGetInvestmentCommand = argument.value.encodeYCCommand(step, context, [tokenPercentageAsCommand]);
    return fullGetInvestmentCommand;
};
/**
 * Create a YC Func which is used to retreive the withdraw shares from memory
 */
//# sourceMappingURL=index.js.map