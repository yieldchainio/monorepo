/**
 * Constants for the offchain clients
 */

import { FunctionCallStruct, YcCommand } from "@yc/yc-models";
import { RequestFullfillEvent } from "../types.js";

// Map requested onchain functions => actual offchain functios
export const OffchainActions: Record<
  string,
  (requestedCommand: FunctionCallStruct) => Promise<YcCommand>
> = {};
