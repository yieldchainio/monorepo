/**
 * Function to attempt getting some underlying contract according
 * to potentially unique contract IDs
 *
 * i.e, yc-diamond refers to the address of the diamond contract we deployed on a given network.
 * lending-adapter refers to the lending adapter address of a given protocol on a given network,
 * etc
 */

import { ZeroAddress } from "ethers";
import {
  YCClassifications,
  YCContract,
  YCFunc,
  YCNetwork,
} from "../../../core/index.js";
import { JSONStep, address } from "../../../types/index.js";

const LENDING_ADAPTER_IDENTIFIER = "lending-adapter";

export function tryGetUnderlyingContract(
  step: JSONStep,
  contract: YCContract,
  fallback: address = contract.address as address
): address {
  if (!contract?.address)
    throw "Cannot Attempt Getting Underlying Contract - Function Contract Undefined";
  switch (contract.id) {
    case YCContract.diamondIdentifier:
      return _getFunctionDiamondContract(step);
    case LENDING_ADAPTER_IDENTIFIER:
      return _getFunctionLendingAdapterContract(step);

    default:
      return fallback || (ZeroAddress as address);
  }
}

function _getFunctionDiamondContract(step: JSONStep, func?: YCFunc): address {
  const network = YCClassifications.getInstance().getNetwork(step.chainId);
  if (!network?.diamondAddress)
    throw (
      "Cannot Encode A Function When Diamond Address Is Undefined. Network: " +
        network?.id +
        " Function Name: " +
        func?.name || "No Function Provided"
    );

  return network.diamondAddress;
}

function _getFunctionLendingAdapterContract(step: JSONStep): address {
  const network = YCClassifications.getInstance().getNetwork(step.chainId);

  if (!network) throw "Cannot Encode A Function When network undefined";

  if (!step.protocol)
    throw "Cannot encode lending function when protocol undefined on step";

  const protocol = YCClassifications.getInstance().getProtocol(step.protocol);

  if (!protocol)
    throw "Cannot encode lending function when protocol undefined on step";

  const contract = YCClassifications.getInstance().addresses.find(
    (address) =>
      address.protocol?.id == protocol.id &&
      address.id.includes("LENDINGADAPTER") &&
      address.network?.id == step.chainId
  );

  if (!contract)
    throw "Cannot encode lending function - Lending adapter undefined on protocol & network";

  return contract.address as address;
}
