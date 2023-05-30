/**
 * Function to call when the LP config is complete
 */

import { Step } from "utilities/classes/step";
import {
  PerpBasketLpData,
  YCArgument,
  YCClassifications,
  YCFunc,
  YCProtocol,
  YCToken,
} from "@yc/yc-models";
import { ethers } from "ethers";
import { ADD_LIQUIDITY_FUNCTION_ID } from "../../../constants";
import { getLpClientId } from "../../../utils/get-lp-client-id";

export const completePerpBasketLPConfig = (
  step: Step,
  context: YCClassifications
) => {
  // Get the LP data
  const data = step.data?.perpBasketLp as PerpBasketLpData;

  // Assert that all data must be present
  if (
    !data.protocol ||
    !data.basketDepositToken ||
    !data.basketRepresentationToken
  )
    throw "Cannot Complete Perp Basket LP Config - Data Is Not Complete.";

  const protocolLPClientID = getLpClientId(
    new YCProtocol(data.protocol, YCClassifications.getInstance())
  );

  const addLiquidityRawFunction = context.rawFunctions.find(
    (func) => func.id == ADD_LIQUIDITY_FUNCTION_ID
  );

  if (!addLiquidityRawFunction)
    throw "Cannot Complete LP - Add Liquidityy Function Undefined";

  const addLiquidityFunction = new YCFunc(
    addLiquidityRawFunction,
    YCClassifications.getInstance()
  );

  // The arguments that can be just set in custom args (simple values)
  // First token is the deposit token user chose for the basket, second token
  // is dismissed onchain
  const customArgs = [
    data.basketDepositToken.address,
    ethers.constants.AddressZero,
    protocolLPClientID,
  ];

  const basketDepositTOkenBalanceArgInstance = (
    addLiquidityFunction.arguments[2].value as YCFunc
  ).arguments[0].value as YCFunc;

  basketDepositTOkenBalanceArgInstance.arguments[0].setValue(
    data.basketDepositToken.address
  );

  addLiquidityFunction.arguments[2].relatingToken = new YCToken(
    data.basketDepositToken,
    YCClassifications.getInstance()
  );

  // Again, it is unused
  addLiquidityFunction.arguments[3] = YCArgument.emptyArgument();

  step.setFunction(addLiquidityFunction);

  // We add the custom args, times 2, which will be used in uproot encoding
  // of the removeLiquidity function in balanceOfLp() (removeLiquidity will shift tokenA, tokenB, then balanceOfLp
  // will shift clientId, token a & b again, then removeLiquidity will shift the last client ID)
  step.customArguments = customArgs.concat(customArgs);

  // Create a new YC token as the inflow for the token
  const lpToken: YCToken = new YCToken(data.basketRepresentationToken, context);

  // Add it as an inflow
  step.clearInflows();
  step.addInflow(lpToken);

  return;
};
