import { Log } from "ethers";
import { SupportedYCNetwork } from "../types.js";
export declare class OnchainListener {
    private networks;
    readonly maxConnectionRetries: number;
    readonly eventHandler: (onchainEvent: Log, provider: SupportedYCNetwork) => Promise<void>;
    readonly eventSignature: string;
    constructor(eventSignature: string, eventHandler: (onchainEvent: Log, provider: SupportedYCNetwork) => Promise<void>, providers: SupportedYCNetwork[], maxConnectionRetries: number);
    /**
     * @notice
     * Listen to all providers
     */
    listenToAll(): Promise<void>;
    /**
     * Listen to a single provider
     */
    listen(providerIdx: number, retry?: number): Promise<void>;
    /**
     * Stop listening to all providers
     */
    stopListening(): Promise<void>;
    restartListeners(): Promise<void>;
}
