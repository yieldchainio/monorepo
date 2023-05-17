import { address } from "@yc/yc-models";
import { SupportedYCNetwork } from "../types.js";
import { Contract } from "ethers";
import factoryABI from "@yc/yc-models/src/ABIs/factory.json" assert { type: "json" };

const diamondContractsCache = new Map<address, Contract>();

const getDiamondContract = (network: SupportedYCNetwork) => {
  const existing = diamondContractsCache.get(network.diamondAddress);
  if (existing) return existing;
  const contract = new Contract(
    network.diamondAddress,
    factoryABI,
    network.provider
  );
  diamondContractsCache.set(network.diamondAddress, contract);
  return contract;
};

/**
 * Checks if an address is a YC strategy contract
 * @param address - The address to check
 * @param network - The network to check on
 * @returns Whether it is a YC strategy or not
 */
export const isRegisteredStrategy = async (
  address: address,
  network: SupportedYCNetwork
) => {
  const diamondContract = getDiamondContract(network);
  return !!(await diamondContract.getStrategyState(address)).registered;
};
