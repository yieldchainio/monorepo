import { JSONTier } from "../../types";
import { YCNetwork } from "../network/network";
export declare class YCTier {
    #private;
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
    details(network: YCNetwork, cache?: boolean): Promise<{
        isActive: boolean;
        powerLevel: bigint;
        monthlyPrice: bigint;
        lifetimePrice: bigint;
    }>;
}
