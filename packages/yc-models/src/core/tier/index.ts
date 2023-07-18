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
   * The name of this token
   */
  readonly name: string;

  /**
   * Benefits of this tier
   */
  readonly benefits: string[];

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
  }
  // =======================
  //        METHODS
  // =======================
  async details(network: YCNetwork): Promise<{
    isActive: boolean;
    powerLevel: bigint;
    monthlyPrice: bigint;
    lifetimePrice: bigint;
  }> {
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

    return {
      isActive: details[0],
      powerLevel: details[1],
      monthlyPrice: details[2],
      lifetimePrice: details[3],
    };
  }
}
