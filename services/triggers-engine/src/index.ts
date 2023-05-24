/**
 * Manages triggering strategies
 */
import { YCClassifications } from "@yc/yc-models";
import { ethers } from "ethers";

const ycContext = YCClassifications.getInstance();

// Initiallize YC context
if (!ycContext.initiallized) await ycContext.initiallize();

// Get all the supported networks
const supportedNetworks = ycContext.networks.filter(
  (network) => network.diamondAddress && network.provider
);

for (const network of supportedNetworks) {
  network.provider.on("block", () => {});
}
