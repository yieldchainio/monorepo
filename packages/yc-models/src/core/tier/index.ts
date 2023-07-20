import { Contract } from "ethers";
import { JSONTier, address } from "../../types";
import { YCNetwork } from "../network/network";
import DiamondABI from "../../ABIs/diamond.json" assert { type: "json" };
import { YCClassifications } from "../..";

export class YCTier {
  // ============
  //    FIELDS
  // ============

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

  // =======================
  //      CONSTRUCTOR
  // =======================
  constructor(_tier: JSONTier) {
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
  getDuration(tokenAmount: bigint): number {
    return Number(tokenAmount / this.monthlyPrice);
  }
  // =======================
  //        METHODS
  // =======================

  async populateUpgradeTransaction(
    amount: bigint,
    isLifetime: boolean,
    network: YCNetwork
  ) {
    if (!network.diamondAddress || !network.provider)
      throw "Cannot Get Tier Details - Diamond Address Undefined";

    const diamond = new Contract(
      network.diamondAddress,
      DiamondABI,
      network.provider
    );

    return diamond.upgradeTier.populateTransaction(this.id, amount, isLifetime);
  }

  static async fromUserAddress(address: address, network: YCNetwork) {
    if (!network.diamondAddress || !network.provider)
      throw "Cannot Get Tier Details - Diamond Address Undefined";

    const diamond = new Contract(
      network.diamondAddress,
      DiamondABI,
      network.provider
    );

    const tierID = (await diamond.getUserTier(address))[0];

    const tier = YCClassifications.getInstance().tiers.find(
      (_tier) => _tier.id == tierID
    );

    if (!tier) return YCClassifications.getInstance().tiers[0];
    return tier;
  }
}
