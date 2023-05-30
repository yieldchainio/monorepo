/**
 * Complete the swap configuration
 */

import {
  DBArgument,
  DBFunction,
  YCArgument,
  YCClassifications,
  YCFunc,
  YCToken,
} from "@yc/yc-models";
import { Step } from "utilities/classes/step";
import { SwapData } from "../types";
import { buildSwapFunction } from "@yc/yc-models";

export const completeSwapConfig = (step: Step, context: YCClassifications) => {
  const data = step.data?.swap as SwapData;

  // Assert that all data must be present
  if (!data.fromToken || !data.toToken)
    throw "Cannot Complete Swap Config - Data Is Not Complete.";

  // Custom arguments for the swap function
  const fromToken = data.fromToken;
  const toToken = data.toToken;

  // Get the swap function for our from => to tokens
  const swapFunc = buildSwapFunction(
    new YCToken(fromToken, context),
    new YCToken(toToken, context)
  );

  step.setFunction(swapFunc);

  // Set them
  step.customArguments = [fromToken.address, toToken.address];
  return;
};
