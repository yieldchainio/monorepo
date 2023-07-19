import { Contract } from "ethers";
import { JSONTier } from "../../types";
import { YCNetwork } from "../network/network";
import DiamondABI from "../../ABIs/diamond.json" assert { type: "json" };

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
  //        METHODS
  // =======================
  #details: {
    isActive: boolean;
    powerLevel: bigint;
    monthlyPrice: bigint;
    lifetimePrice: bigint;
  } | null = null;

  async details(
    network: YCNetwork,
    cache: boolean = true
  ): Promise<{
    isActive: boolean;
    powerLevel: bigint;
    monthlyPrice: bigint;
    lifetimePrice: bigint;
  }> {
    if (cache && this.#details) return this.#details;
    if (!network.diamondAddress || !network.provider)
      throw "Cannot Get Tier Details - Diamond Address Undefined";

    const diamond = new Contract(
      network.diamondAddress,
      DiamondABI,
      network.provider
    );

    const details: [boolean, bigint, bigint, bigint] = await diamond.getTier(
      this.id
    );

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
