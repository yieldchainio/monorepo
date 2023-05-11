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
import { BALANCEOF_FUNCTION_ID, SWAP_FUNCTION_ID } from "../consants";
import { v4 as uuid } from "uuid";
import { ethers } from "ethers";
import { Typeflags } from "@prisma/client";

export const completeSwapConfig = (step: Step, context: YCClassifications) => {
  const data = step.data?.swap as SwapData;

  // Assert that all data must be present
  if (!data.fromToken || !data.toToken)
    throw "Cannot Complete Swap Config - Data Is Not Complete.";

  // Get the swap function (LI.Fi)
  const swapJsonFunction = context.rawFunctions.find(
    (func) => func.id == SWAP_FUNCTION_ID
  );

  // Assert that it must exist
  if (!swapJsonFunction)
    throw "Cannot Complete Swap Config - Swap Function Is Non-Existant.";
  const swapFunction = new YCFunc(
    swapJsonFunction,
    YCClassifications.getInstance()
  );

  // Set the step's function to the swap function
  step.setFunction(swapFunction);

  // Custom arguments for the swap function
  const fromToken = data.fromToken;
  const toToken = data.toToken;

  // 3rd argument for amount, we insert a custom balanceOf arg to getInvestmentAmount
  const fromTokenDBArgument: DBArgument = {
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

  const fromTokenDynamicBalanceof: DBArgument = {
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
  const tokenBalanceOfGetter = new YCArgument(
    fromTokenDynamicBalanceof,
    YCClassifications.getInstance()
  );

  (tokenBalanceOfGetter.value as YCFunc).arguments[0] = new YCArgument(
    fromTokenDBArgument,
    YCClassifications.getInstance()
  );

  console.log(swapFunction);

  // Insert our new balanceOf getter to the getInvestmentAmount args
  (swapFunction.arguments[2].value as YCFunc).arguments[0] =
    tokenBalanceOfGetter;

  // Set the relating token on it
  swapFunction.arguments[2].relatingToken = new YCToken(fromToken, context);

  // Set them
  step.customArguments = [fromToken.address, toToken.address];
  return;
};
