import { JSONTier, address } from "../../types";
import { YCNetwork } from "../network/network";
export declare class YCTier {
    /**
     * ID Of the tier
     */
    readonly id: number;
    /**
     * The name of this tier
     */
    readonly name: string;
    /**
     * Title of the tier
     */
    readonly title: string;
    /**
     * Description of the tier
     */
    readonly description: string;
    /**
     * Benefits of this tier
     */
    readonly benefits: string[];
    /**
     * Prices of the tier
     */
    readonly monthlyPrice: bigint;
    readonly lifetimePrice: bigint;
    constructor(_tier: JSONTier);
    /**
     * Get the duration a token amount would be sufficent for (Months)
     * @param tokenAmount - Amount of tokens to get the duration of (@notice decimals included!!)
     * @return duration the token amount would be sufficient for in months
     */
    getDuration(tokenAmount: bigint): number;
    populateUpgradeTransaction(amount: bigint, isLifetime: boolean, network: YCNetwork): Promise<import("ethers").ContractTransaction>;
    static fromUserAddress(address: address, network: YCNetwork): Promise<YCTier>;
}
