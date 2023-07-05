import { YCNetwork } from "@yc/yc-models";
import { Provider } from "ethers";

export function isValidNetwork(network?: YCNetwork | null): network is YCNetwork & {} {
  if (network && "id" in network && "provider" in network && "jsonRpc" in network && network.jsonRpc != null) return true;
  return false;
}
