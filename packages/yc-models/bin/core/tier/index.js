import { Contract } from "ethers";
import DiamondABI from "../../ABIs/diamond.json" assert { type: "json" };
import { YCClassifications } from "../..";
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
        this.monthlyPrice = BigInt(_tier.monthly_price);
        this.lifetimePrice = BigInt(_tier.lifetime_price);
    }
    // =======================
    //        GETTERS
    // =======================
    /**
     * Get the duration a token amount would be sufficent for (Months)
     * @param tokenAmount - Amount of tokens to get the duration of (@notice decimals included!!)
     * @return duration the token amount would be sufficient for in months
     */
    getDuration(tokenAmount) {
        return Number(tokenAmount / this.monthlyPrice);
    }
    // =======================
    //        METHODS
    // =======================
    async populateUpgradeTransaction(amount, isLifetime, network) {
        if (!network.diamondAddress || !network.provider)
            throw "Cannot Get Tier Details - Diamond Address Undefined";
        const diamond = new Contract(network.diamondAddress, DiamondABI, network.provider);
        return diamond.upgradeTier.populateTransaction(this.id, amount, isLifetime);
    }
    static async fromUserAddress(address, network) {
        if (!network.diamondAddress || !network.provider)
            throw "Cannot Get Tier Details - Diamond Address Undefined";
        const diamond = new Contract(network.diamondAddress, DiamondABI, network.provider);
        const tierID = (await diamond.getUserTier(address))[0];
        console.log("User Tier From Onchain", tierID);
        const tier = YCClassifications.getInstance().tiers.find((_tier) => _tier.id == tierID);
        if (!tier)
            return YCClassifications.getInstance().tiers[0];
        return tier;
    }
}
//# sourceMappingURL=index.js.map