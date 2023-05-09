import {
  TokenPercentageImplementor,
  YCArgument,
  YCClassifications,
  YCFunc,
} from "../../../../core";
import { EncodingContext } from "../../../../types";

const WITHDRAW_SHARES_RETREIVER_FUNCTION_ID = "000";

/**
 * Encode a getInvestmentAmount() YC Command
 */
export const encodeGetInvestmentAmount = (
  step: TokenPercentageImplementor,
  context: EncodingContext,
  argument: YCArgument,
  customValues: Array<any | YCFunc>
): string => {
  // YCArgument value must be function
  if (!(argument.value instanceof YCFunc))
    throw "Cannot Encode Get Investment Amount - Not A Function";

  // Must have a relating token
  if (!argument.relatingToken)
    throw "Cannot Encode Get Investment Amount - No Relating Token";

  // @notice
  // We first chec to see if the context is UPROOT. If it is,
  // Then we actually add another function call instead of the set token percentage,
  // which is used to MLOAD the shares % the user is trying to withdraw
  if (context == EncodingContext.UPROOT) {
    // Get the withdraw shares retreiver function
    const withdrawalFunc = YCClassifications.getInstance().getFunction(
      WITHDRAW_SHARES_RETREIVER_FUNCTION_ID
    );
    if (!withdrawalFunc)
      throw "Cannot Encode Get Investmnet Amount - Context is uproot, and cannot get Withdrawal Shares Retreiver from context";

    // Insert it to custom values (At this point the recursive list)
    // Will have the args of our argument as the first 2, then the rest
    customValues.splice(1, 0, withdrawalFunc);

    // Enocde the function (it will use the custom value) and return
    return argument.encodeYCCommand(step, context, customValues);
  }

  // Get the token percentage from the step, assert that it must exist also
  const tokenPercentage = step.tokenPercentages.get(argument.relatingToken.id);
  if (!tokenPercentage)
    throw "Cannot Encode Get Investment Amount - No Token Percentage Set";

  // Push it to the custom values
  customValues.splice(1, 0, tokenPercentage);

  // Now encode it as a YC command, it will use the new custom value when encoding
  return argument.encodeYCCommand(step, context, customValues);
};

/**
 * Create a YC Func which is used to retreive the withdraw shares from memory
 */
