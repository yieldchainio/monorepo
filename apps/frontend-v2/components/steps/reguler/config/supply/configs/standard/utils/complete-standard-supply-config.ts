/**
 * Function to call when the LP config is complete
 */

import { Step } from "utilities/classes/step";
import { AddLiquidityData } from "../../../types";
import {
  DBArgument,
  DBToken,
  SupplyData,
  YCClassifications,
  YCContract,
  YCFunc,
  YCProtocol,
  YCToken,
} from "@yc/yc-models";
import { v4 as uuid } from "uuid";
import { constants, ethers } from "ethers";
import { SUPPLY_FUNCTION_ID } from "../../../constants";
import { getProtocolClientId } from "components/steps/utils/get-client-id";

export const completeStandardSupply = (
  step: Step,
  context: YCClassifications
) => {
  // Get the LP data
  const data = step.data?.supply as SupplyData;

  // Assert that all data must be present
  if (!data.protocol || !data.collateral || !data.representationToken)
    throw "Cannot Complete Lending Config - Data Is Not Complete.";

  const clientId = getProtocolClientId(
    new YCProtocol(data.protocol, YCClassifications.getInstance())
  );

  const supplyFunction =
    YCClassifications.getInstance().getFunction(SUPPLY_FUNCTION_ID);

  if (!supplyFunction)
    throw "Cannot Complete Lending Config - Supply Function Is undefined";

  const newSupplyFunction = new YCFunc(
    { ...supplyFunction.toJSON() },
    YCClassifications.getInstance()
  );

  _setBalanceOfTokenInGIA(newSupplyFunction, 2, data.collateral);

  newSupplyFunction.outflows = step.outflows;
  newSupplyFunction.inflows = step.inflows;

  step.setFunction(newSupplyFunction);

  // The arguments that can be just set in custom args (simple values)
  const customArgs = [
    clientId,
    data.collateral.address,
    data.collateral.address, // Used in balanceOf(token) function
    ethers.constants.HashZero, // Empty extra args
  ];

  const withdrawalCustomArgs = [
    clientId,
    data.collateral.address,
    clientId, // Client ID for balanceOfPosition
    data.collateral.address, // Address for balanceOfPosition
    ethers.constants.HashZero,
  ];

  step.customArguments = customArgs.concat(withdrawalCustomArgs);

  step.retainCustomArgsRef = true;

  const harvestInterestFunction = YCClassifications.getInstance().getFunction(
    "892498b9-0aff-4b27-8341-8cec464cc76a"
  );

  if (!harvestInterestFunction)
    throw "Cannot Find Interest Harvest Func in Supply";

  const newHarvestInterestFunction = new YCFunc(
    { ...harvestInterestFunction.toJSON() },
    YCClassifications.getInstance()
  );

  newHarvestInterestFunction.inflows.push(
    new YCToken(data.collateral, YCClassifications.getInstance())
  );

  newHarvestInterestFunction.dependencyFunction = step.function;

  (newHarvestInterestFunction.address as YCContract).protocol = step.protocol;

  step.unlockedFunctions.push({
    func: newHarvestInterestFunction,
    used: false,
    customArgs: [clientId, data.collateral.address, constants.HashZero],
  });

  return;
};

function _setBalanceOfTokenInGIA(
  originFunction: YCFunc,
  giaIdx: number,
  token: YCToken | DBToken
) {
  const giaArg = originFunction.arguments[giaIdx];

  giaArg.relatingToken =
    token instanceof YCToken
      ? token
      : new YCToken(token, YCClassifications.getInstance());
}
