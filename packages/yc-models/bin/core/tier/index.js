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
     * The name of this tier
     */
    name;
    /**
     * Title of the tier
     */
    title;
    /**
     * Description of the tier
     */
    description;
    /**
     * Benefits of this tier
     */
    benefits;
    /**
     * Prices of the tier
     */
    monthlyPrice;
    lifetimePrice;
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
        this.title = _tier.title;
        this.description = _tier.description;
        this.monthlyPrice = _tier.monthly_price;
        this.lifetimePrice = _tier.lifetime_price;
    }
    // =======================
    //        METHODS
    // =======================
    #details = null;
    async details(network, cache = true) {
        if (cache && this.#details)
            return this.#details;
        if (!network.diamondAddress || !network.provider)
            throw "Cannot Get Tier Details - Diamond Address Undefined";
        const diamond = new Contract(network.diamondAddress, DiamondABI, network.provider);
        const details = await diamond.getTier(this.id);
        const obj = {
            isActive: details[0],
            powerLevel: details[1],
            monthlyPrice: details[2],
            lifetimePrice: details[3],
        };
        this.#details = obj;
        return obj;
    }
}
//# sourceMappingURL=index.js.map