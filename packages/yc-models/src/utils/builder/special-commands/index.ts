import { STATICCALL_COMMAND_FLAG, TypeflagValues } from "../../../constants";
import { TokenPercentageImplementor, YCArgument, YCFunc } from "../../../core";
import { EncodingContext } from "../../../types";
import { encodeGetInvestmentAmount } from "./get-investment-amount";

/**
 * Map function names to parsers
 */
const UtilityCommandEncoders: Record<string, Function> = {
  getInvestmentAmount: encodeGetInvestmentAmount,
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
export const encodeUniqueCommands = (
  step: TokenPercentageImplementor,
  context: EncodingContext,
  argument: YCArgument,
  customValues: Array<any | YCFunc>
): string | null => {
  // We only parse functions as utility commands
  if (!(argument.value instanceof YCFunc)) return null;

  // Return either the uniquely-encoded command or null if none
  return (
    UtilityCommandEncoders[argument.value.name](
      step,
      context,
      argument,
      customValues
    ) || null
  );
};
