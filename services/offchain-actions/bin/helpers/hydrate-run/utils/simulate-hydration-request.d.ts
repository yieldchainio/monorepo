import { YcCommand } from "@yc/yc-models";
import { HydrationRequest } from "../classes/hydration-request.js";
/**
 * @notice
 * Simulate an operation item run, hydrate an array of YC commands, and return them
 * @param hydrationRequest - The hydration request to simulate
 * @param network - A supported YC Network, will be used to create a fork
 * @return hydratedCommands - An array of commands hydrated from the offchain actions
 */
export declare function simulateHydrationRequest(hydrationRequest: HydrationRequest): Promise<Array<YcCommand>>;
