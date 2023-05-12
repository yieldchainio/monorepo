import { YCArgument, YCFunc } from "../../../core/index.js";
import { EncodingContext, JSONStep } from "../../../types/index.js";
import { encodeGetInvestmentAmount } from "./get-investment-amount/index.js";

// Constants
const GET_INVESTMENT_AMOUNT_ID = "b6ce56d0-d032-47ed-a3ff-8dedd81f0c2d";

/**
 * Map function names to parsers
 */
const UtilityCommandEncoders: Record<
  string,
  (step: JSONStep, context: EncodingContext, argument: YCArgument) => string
> = {
  [GET_INVESTMENT_AMOUNT_ID]: encodeGetInvestmentAmount,
};

/**
 * @notice
 * Helper function to parse, based on a switch-case, some utility commands
 * @param step - Instance of a step that implements some variables we need
 * @param context - Encoding context (SEED, TREE, UPROOT)
 * @param argument - The argument to aprse for utility methods
 * @param customValues - Array of custom values provided to the argument
 * @returns encodedCommand - Either an encoded command if found utility to parse, or null if none
 */
export const trySpecialEncoding = (
  step: JSONStep,
  context: EncodingContext,
  argument: YCArgument
): string | null => {
  // We only parse functions as special commands
  if (!(argument.value instanceof YCFunc)) return null;

  // Return either the speicla-encoded command or null if none
  return (
    UtilityCommandEncoders[argument.value.id]?.(step, context, argument) || null
  );
};
