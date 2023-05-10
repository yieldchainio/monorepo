/**
 * Complete the swap configuration
 */

import { YCClassifications } from "@yc/yc-models";
import { Step } from "utilities/classes/step";
import { SwapData } from "../types";
import { SWAP_FUNCTION_ID } from "../consants";
import { constants } from "ethers";

export const completeSwapConfig = (step: Step, context: YCClassifications) => {
  // Get the LP data
  const data = step.data?.swap as SwapData;

  // Assert that all data must be present
  if (!data.fromToken || !data.toToken)
    throw "Cannot Complete Swap Config - Data Is Not Complete.";

  // Get the swap function (LI.Fi)
  const swapFunction = context.getFunction(SWAP_FUNCTION_ID);

  // Assert that it must exist
  if (!swapFunction)
    throw "Cannot Complete Swap Config - Swap Function Is Non-Existant.";

  // Set the step's function to the swap function
  step.setFunction(swapFunction);

  // Custom arguments for the swap function
  const fromToken = data.fromToken;
  const toToken = data.toToken;
  const fromAmount = 1; // TODO: Amount Getter Function Ser
  const toAddress = constants.AddressZero; // TODO: Own address getter function ser

  // Set them
  step.customArguments = [fromToken, toToken, fromAmount, toAddress].map(
    (arg) => ({
      value: arg,
      customArgs: [],
      editable: false,
      preConfigured: true,
    })
  );

  return;
};
