import { JSONTier } from "../../types";
import { YCNetwork } from "../network/network";
export declare class YCTier {
    /**
     * ID Of the tier
     */
    readonly id: number;
    /**
     * The name of this token
     */
    readonly name: string;
    /**
     * Benefits of this tier
     */
    readonly benefits: string[];
    constructor(_tier: JSONTier);
    details(network: YCNetwork): Promise<{
        isActive: boolean;
        powerLevel: bigint;
        monthlyPrice: bigint;
        lifetimePrice: bigint;
    }>;
}
