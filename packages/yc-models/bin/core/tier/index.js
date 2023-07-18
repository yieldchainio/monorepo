import { Contract } from "ethers";
import DiamondABI from "../../ABIs/diamond.json" assert { type: "json" };
export class YCTier {
    // ============
    //    FIELDS
    // ============
    /**
     * ID Of the tier
     */
    id;
    /**
     * The name of this token
     */
    name;
    /**
     * Benefits of this tier
     */
    benefits;
    // =======================
    //      CONSTRUCTOR
    // =======================
    constructor(_tier) {
        /**
         * Init static vars
         */
        this.name = _tier.name;
        this.id = _tier.id;
        this.benefits = _tier.benefits;
    }
    // =======================
    //        METHODS
    // =======================
    async details(network) {
        if (!network.diamondAddress || !network.provider)
            throw "Cannot Get Tier Details - Diamond Address Undefined";
        const diamond = new Contract(network.diamondAddress, DiamondABI, network.provider);
        const details = await diamond.getTier(this.id);
        return {
            isActive: details[0],
            powerLevel: details[1],
            monthlyPrice: details[2],
            lifetimePrice: details[3],
        };
    }
}
//# sourceMappingURL=index.js.map