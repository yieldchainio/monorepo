import { JsonRpcProvider } from "ethers";
import { address, bytes, bytes32 } from "@yc/yc-models";
/**
 * Main fork class
 * @extends ethers.JsonRpcProvider
 * @param rpcUrl - The RPC Url to fork
 * @return Fork instance, extends the ethers provider class that provides all different methods on it. Also provides
 * different methods for abstracting use with Anvil-specific fork RPC methods
 */
export declare class Fork extends JsonRpcProvider {
    #private;
    /**
     * Should only be initiallized using this static function,
     * because we need to super the new RPC url which takes time ot resolve (finding a free port)
     */
    static fromRpcUrl(rpcURL: string): Promise<Fork>;
    private constructor();
    enableLog(): Promise<void>;
    /**
     * Prank an address
     */
    prank(address: address): Promise<void>;
    /**
     * Auto prank all addresses
     */
    autoClownster(): Promise<void>;
    /**
     * Stop pranking an address
     */
    stopPrank(): Promise<void>;
    /**
     * Snapshot the state to later revert to
     */
    snap(): Promise<void>;
    /**
     * Revert to snap
     */
    rollback(): Promise<void>;
    /**
     * Change byteconde at contract
     */
    etch(address: address, newCode: bytes): Promise<void>;
    /**
     * Write to storage manually
     */
    write(address: address, slot: bytes32, newValue: bytes): Promise<void>;
    /**
     * Kill the fork
     */
    kill(): Promise<void>;
    /**
     * Get current gas price
     */
    gasPrice(): Promise<any>;
}
