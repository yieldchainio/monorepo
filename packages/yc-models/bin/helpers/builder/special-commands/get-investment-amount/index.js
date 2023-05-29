import { YCClassifications, YCFunc, } from "../../../../core/index.js";
import { EncodingContext } from "../../../../types/index.js";
// Constants
const WITHDRAW_SHARE_GETTER_ARG_ID = "7ccd7271-211b-4a19-8556-8fdf16e1235e";
/**
 * Encode a getInvestmentAmount() YC Command
 */
export const encodeGetInvestmentAmount = (step, context, argument) => {
    // YCArgument value must be function
    if (!(argument.value instanceof YCFunc))
        throw "Cannot Encode Get Investment Amount - Not A Function";
    // @notice
    // We first check to see if the context is UPROOT. If it is,
    // Then we actually add another function call instead of the set token percentage,
    // which is used to MLOAD the shares % the user is trying to withdraw
    if (context == EncodingContext.UPROOT) {
        const withdrawShareRetreiverArg = YCClassifications.getInstance().getArgument(WITHDRAW_SHARE_GETTER_ARG_ID);
        if (!withdrawShareRetreiverArg)
            throw "Cannot Encode Get Investment Amount - Withdraw Shares Getter Arg Is undefined";
        argument.value.arguments[1] = withdrawShareRetreiverArg;
        return argument.value.encodeYCCommand(step, context, []);
    }
    // Must have a relating token if not an uproot context encoding
    if (!argument.relatingToken)
        throw "Cannot Encode Get Investment Amount - No Relating Token";
    // Get the token percentage from the step, assert that it must exist also
    const tokenPercentage = new Map(step.tokenPercentages).get(argument.relatingToken.id);
    if (!tokenPercentage)
        throw "Cannot Encode Get Investment Amount - No Token Percentage Set";
    const fullGetInvestmentCommand = argument.value.encodeYCCommand(step, context, [(100 / tokenPercentage) * 100]);
    return fullGetInvestmentCommand;
};
//# sourceMappingURL=index.js.map