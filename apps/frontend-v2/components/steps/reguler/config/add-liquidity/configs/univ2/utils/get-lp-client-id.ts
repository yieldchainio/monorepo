/**
 * Compute the client ID of a protocol
 * @param protocol - A YCProtocol
 * @returns clientId
 */

import { YCProtocol, bytes32 } from "@yc/yc-models";
import { ethers } from "ethers";

export function getLpClientId(protocol: YCProtocol): bytes32 {
  return ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(["string"], [protocol.id])
  );
}
