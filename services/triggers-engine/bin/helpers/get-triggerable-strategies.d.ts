/**
 * Get all triggerable strategies
 * @param network - Supported YC Network
 * @return triggerableStrategies - Got from onchain
 */
import { SupportedYCNetwork } from "@yc/yc-models";
export declare function getTriggerableStrategies(network: SupportedYCNetwork): Promise<void>;
