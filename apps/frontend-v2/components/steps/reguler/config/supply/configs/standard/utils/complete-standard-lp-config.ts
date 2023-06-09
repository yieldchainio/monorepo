/**
 * Function to call when the LP config is complete
 */

import { Step } from "utilities/classes/step";
import { AddLiquidityData } from "../../../types";
import {
  DBArgument,
  YCClassifications,
  YCFunc,
  YCProtocol,
  YCToken,
} from "@yc/yc-models";
import { v4 as uuid } from "uuid";
import { constants } from "ethers";
import { ADD_LIQUIDITY_FUNCTION_ID } from "../../../constants";
import { getProtocolClientId } from "components/steps/utils/get-client-id";

export const completeUniV2LPConfig = (
  step: Step,
  context: YCClassifications
) => {
  // Get the LP data
  const data = step.data?.lp as AddLiquidityData;

  // Assert that all data must be present
  if (!data.protocol || !data.tokenA || !data.tokenB)
    throw "Cannot Complete LP Config - Data Is Not Complete.";

  const protocolLPClientID = getProtocolClientId(
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
  const customArgs = [
    data.tokenA.address,
    data.tokenB.address,
    protocolLPClientID,
  ];

  const tokenABalanceArgInstance = (
    addLiquidityFunction.arguments[2].value as YCFunc
  ).arguments[0].value as YCFunc;
  const tokenBBalanceArgInstance = (
    addLiquidityFunction.arguments[3].value as YCFunc
  ).arguments[0].value as YCFunc;

  tokenABalanceArgInstance.arguments[0].setValue(data.tokenA.address);
  tokenBBalanceArgInstance.arguments[0].setValue(data.tokenB.address);

  addLiquidityFunction.arguments[2].relatingToken = new YCToken(
    data.tokenA,
    YCClassifications.getInstance()
  );

  addLiquidityFunction.arguments[3].relatingToken = new YCToken(
    data.tokenA,
    YCClassifications.getInstance()
  );

  step.setFunction(addLiquidityFunction);

  // We add the custom args, times 2, which will be used in uproot encoding
  // of the removeLiquidity function in balanceOfLp() (removeLiquidity will shift tokenA, tokenB, then balanceOfLp
  // will shift clientId, token a & b again, then removeLiquidity will shift the last client ID)
  step.customArguments = customArgs.concat(customArgs);

  // Create a new YC token as the inflow for the token
  const lpToken: YCToken = new YCToken(
    {
      id: uuid(),
      name: `${data.tokenA.symbol} + ${data.tokenB.symbol} ${data.protocol.name} LP`,
      symbol: `${data.protocol.name}-LP`,
      address: constants.AddressZero,
      logo: `${data.protocol.logo}`,
      decimals: 18,
      chain_id: data.tokenA.chain_id,
      tags: [],
      parent_protocol: data.protocol.id,
      markets_ids: []
    },
    context
  );

  // Add it as an inflow
  step.clearInflows();
  step.addInflow(lpToken);

  return;
};
