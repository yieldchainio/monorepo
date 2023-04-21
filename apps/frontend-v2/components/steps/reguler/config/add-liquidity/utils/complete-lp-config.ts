/**
 * Function to call when the LP config is complete
 */

import { Step } from "utilities/classes/step";
import { AddLiquidityData } from "../types";
import { DBToken, YCClassifications, YCToken } from "@yc/yc-models";
import { v4 as uuid } from "uuid";
import { constants } from "ethers";

export const completeLPConfig = (step: Step, context: YCClassifications) => {
  // Get the LP data
  const data = step.data?.lp as AddLiquidityData;

  // Assert that all data must be present
  if (!data.protocol || !data.tokenA || !data.tokenB)
    throw "Cannot Complete LP Config - Data Is Not Complete.";

  // Create a new YC token as the inflow for the token
  const lpToken: YCToken = new YCToken(
    {
      id: uuid(),
      name: `${data.tokenA.symbol} + ${data.tokenB.symbol} ${data.protocol} LP`,
      symbol: `${data.tokenA.symbol}_${data.tokenB.symbol}_LP`,
      address: constants.AddressZero,
      logo: `${data.protocol.logo}`,
      decimals: 18,
      chain_id: data.tokenA.chain_id,
    },
    context
  );

  // Add it as an inflow
  step.addInflow(lpToken);

  // Get the add liquidity function from the context (it's a singleton, on the YC wrapper)
  const addLiqFunction = context.getFunction(ADD_LIQUIDITY_FUNCTION_ID);

  // Assert that it must exist
  if (!addLiqFunction)
    throw "Cannot Complete LP Config - YC Add Liquidity Function Is Non-Existant.";

  // Set our step's function to this function
  step.function = addLiqFunction;

  // Create the custom arguments
  const clientID = data.protocol.id;
  const fromTokenAddresses = [data.tokenA.address];
  const toTokenAddresses = [data.tokenB.address];
  const fromTokenAmounts = [1]; // TODO: Wen Encoding Amount Command
  const toTokenAmounts = [1]; // TODO: Wen Encoding Amount Command
  const slippage = 20; // TODO: Custom field?

  // Set the custom arguments for the add liq function
  step.customArguments = [
    clientID,
    fromTokenAddresses,
    toTokenAddresses,
    fromTokenAmounts,
    toTokenAmounts,
    slippage,
    step.customArguments, // @notice, the generic custom args components has been setting custom args on this field up until this point, whilst the add liquidity function takes a custom arguments field of it's own. So we set the custom args as the desired args for the add liq config, and use the ones optionally inputted by the user up until now as the custom args field on the function itself.
  ];

  return;
};
