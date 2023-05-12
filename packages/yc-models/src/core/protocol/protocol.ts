import { DBProtocol } from "../../types/db.js";
import { YCClassifications } from "../context/context.js";
import { YCSocialMedia } from "../social-media/social-media.js";
import { BaseClass } from "../base/index.js";
import { ProtocolType } from "@prisma/client";
import { YCNetwork } from "../network/network.js";
import { YCToken } from "../token/token.js";
import { YCContract } from "../address/address.js";

/**
 * @notice
 * YCProtocol
 * A class representing a Yieldchain protocol
 */
export class YCProtocol extends BaseClass {
  // =================
  //      FIELDS
  // =================

  /**
   * The ID of this protocol (uuid)
   */
  readonly id: string;

  /**
   * The name of this protocol (Pancakeswap, Uniswap, GMX, etc)
   */
  readonly name: string;

  /**
   * The types of this protocol (EXCHANGE, LIQUIDITY, STAKING, INTEGRATION, etc)
   */
  readonly types: ProtocolType[];

  /**
   * Whether this protocol is available for use or not
   */
  readonly available: boolean;

  /**
   * All of the contracts available under this protocol (that are classified)
   */
  readonly contracts: YCContract[] = [];

  /**
   * The website URL of this protocol (https://uniswap.org)
   */
  readonly website: string;

  /**
   * The logo URI of this protocol
   */
  readonly logo: string;

  /**
   * Social media instance of all of this protocol's social medias
   */
  readonly socialMedia: YCSocialMedia;

  /**
   * Color of this protocol (can be null, frontend)
   */
  readonly color: string | null = null;

  // =======================
  //     UNIQUE FIELDS
  // ======================

  /**
   * All of the tokens available on this protocol.
   * Mostly just relevent for DEXs
   */
  readonly tokens: YCToken[] = [];

  /**
   * The networks this protocol is available on
   */
  readonly networks: YCNetwork[] = [];

  // =======================
  //     CONSTRUCTOR
  // ======================
  constructor(_protocol: DBProtocol, _context: YCClassifications) {
    /**
     * Set static vars
     */
    super();
    this.socialMedia = new YCSocialMedia(
      _protocol.twitter,
      _protocol.telegram,
      _protocol.discord
    );
    this.name = _protocol.name;
    this.website = _protocol.website;
    this.logo = _protocol.logo;
    this.id = _protocol.id;
    this.types = _protocol.types;
    this.available = _protocol.available;
    this.color = _protocol.color;

    /**
     * @notice
     * We set it to the IDs here before gettng our instance so that it matches in stringification, without an infinite limbo.
     * we set it to the actual networks afterwards
     */
    this.networks = _protocol.chain_ids as unknown as YCNetwork[];

    this.contracts = (_protocol.address_ids as unknown as string[]).flatMap(
      (addressID: string) => {
        const address = _context.getAddress(addressID);

        return address ? [address] : [];
      }
    );

    this.networks = _protocol.chain_ids.flatMap((networkID: number) => {
      const network = _context.getNetwork(networkID);

      return network ? [network] : [];
    });
    const existingProtocol = this.getInstance(_protocol.id);
    if (existingProtocol) return existingProtocol;

    // // Find all tokens that are included in this protocol's markets
    // let tokens = _context.tokens
    //   // Filter to include tokens that have the ID in their markets field
    //   .filter((token: YCToken) => token.isInMarket(this.ID()));

    // // Set tokens field
    // this.#tokens = tokens;

    // // Find all networks this protocol is on
    // this.#networks = _context.networks.filter((network: YCNetwork) =>
    //   network.protocols.find(
    //     (_protocol: YCProtocol) => _protocol.ID() == this.ID()
    //   )
    // );

    // // Find all contracts where the parent protocol is this protocol
    // this.#contracts = _context.contracts.filter(
    //   (address: YCContract) => address.protocol()?.ID() == this.ID()
    // );
  }

  // =================
  //   SINGLETON REF
  // =================
  getInstance = (id: string): YCProtocol | null => {
    // We try to find an existing instance of this user
    const existingProtocol = YCProtocol.instances.get(id);

    // If we have an existing user and it has the same fields as this one, we return the singleton of it
    if (existingProtocol) {
      if (this.compare(existingProtocol)) return existingProtocol;
    }

    YCProtocol.instances.set(id, this);

    return null;
  };

  static instances: Map<string, YCProtocol> = new Map();

  // Custom toJSON
  toJSON = (): DBProtocol => {
    return {
      id: this.id,
      name: this.name,
      logo: this.logo,
      available: this.available,
      website: this.website,
      color: this.color,
      chain_ids: this.networks.map((network) => network?.id),
      address_ids: this.contracts.map((address) => address?.id),
      types: this.types,
      twitter: this.socialMedia.twitter.link || "",
      discord: this.socialMedia.discord.link || "",
      telegram: this.socialMedia.telegram.link || "",
    };
  };
}
