import { AbiCoder, ethers } from "ethers";
import {
  TokenPercentageImplementor,
  YCArgument,
  YCClassifications,
  YCFunc,
} from "../../../../core/index.js";
import {
  CustomArgsTree,
  DeployableStep,
  EncodingContext,
  JSONStep,
} from "../../../../types/index.js";
import { FunctionCallStruct } from "../../../../types/onchain.js";
import { TypeflagValues } from "../../../../constants.js";
import { remove0xPrefix } from "../../remove-0x-prefix.js";
import { v4 as uuid } from "uuid";
import { Typeflags } from "@prisma/client";

const WITHDRAW_SHARES_MEM_LOCATION = "0x320";
const MLOAD_FUNCTION_ID = "c20e51e3-3589-4c6c-9b35-29efb3fef29b";
const WITHDRAW_SHARE_GETTER_ARG_ID = "7ccd7271-211b-4a19-8556-8fdf16e1235e";

/**
 * Encode a getInvestmentAmount() YC Command
 */
export const encodeGetInvestmentAmount = (
  step: JSONStep,
  context: EncodingContext,
  argument: YCArgument
): string => {
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
    const withdrawShareRetreiverArg =
      YCClassifications.getInstance().getArgument(WITHDRAW_SHARE_GETTER_ARG_ID);

    if (!withdrawShareRetreiverArg)
      throw "Cannot Encode Get Investment Amount - Withdraw Shares Getter Arg Is undefined";

    argument.value.arguments[1] = withdrawShareRetreiverArg;

    return argument.value.encodeYCCommand(step, context, []);
  }
  // Get the token percentage from the step, assert that it must exist also
  const tokenPercentage = new Map(step.tokenPercentages).get(
    argument.relatingToken.id
  );
  if (!tokenPercentage)
    throw "Cannot Encode Get Investment Amount - No Token Percentage Set";

  const fullGetInvestmentCommand = argument.value.encodeYCCommand(
    step,
    context,
    [(100 / tokenPercentage) * 100]
  );

  return fullGetInvestmentCommand;
};

/**
 * Create a YC Func which is used to retreive the withdraw shares from memory
 */
