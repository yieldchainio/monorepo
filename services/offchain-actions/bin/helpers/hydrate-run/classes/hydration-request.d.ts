/**
 * Class representing an hydration request
 * @param hydrationRequest - Ethers log representing an hydration request
 * @param network - A supported YC network to fork & simulate on top of
 */
import { HydrationRequestEvent, OperationItem } from "../../../types.js";
import { SupportedYCNetwork, YcCommand, address } from "@yc/yc-models";
export declare class HydrationRequest {
    #private;
    constructor(hydrationRequest: HydrationRequestEvent, network: SupportedYCNetwork);
    /**
     * @notice
     * Simulate this hydration request and return the hydrated command calldatas
     */
    simulateHydration(): Promise<YcCommand[]>;
    /**
     * Get the operation index requested here
     * @return OperationItem | null - OperationItem if found, null if not
     */
    getOperation(): Promise<OperationItem | null>;
    /**
     * Get the operation index
     */
    get operationIndex(): number;
    /**
     * Get the address of the strategy that emitted the request
     */
    get strategyAddress(): address;
    /**
     * Get the network
     */
    get network(): SupportedYCNetwork;
}
