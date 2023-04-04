import { ethers } from "ethers";
import { DBProtocol, DBToken } from "../../types/db";
import { YCClassifications } from "../context/context";
import { YCAddress } from "../address/address";
import { YCNetwork } from "../network/network";
import { YCSocialMedia } from "../social-media/social-media";
import { YCToken } from "../token/token";
import { BaseClass } from "../base";

/**
 * @notice
 * YCProtocol
 * A class representing a Yieldchain protocol
 */
export class YCProtocol extends BaseClass {
  // =======================
  //      FIELDS
  // ======================
  readonly id: string;
  readonly name: string;
  readonly website: string;
  readonly logo: string;
  readonly socialMedia: YCSocialMedia;

  // =======================
  //     UNIQUE FIELDS
  // ======================
  // #tokens: YCToken[];
  // #networks: YCNetwork[];
  // #addresses: YCAddress[];
  // #actions: YCAction[]; // TODO: Integrate this when u can, not urgent
  // =======================
  //     CONSTRUCTOR
  // ======================
  constructor(_protocol: DBProtocol, _context: YCClassifications) {
    super();
    // Set static
    this.socialMedia = new YCSocialMedia(
      _protocol.twitter,
      _protocol.telegram,
      _protocol.discord
    );

    this.name = _protocol.name;

    this.website = _protocol.website;

    this.logo = _protocol.logo;

    this.id = _protocol.id;

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

    // // Find all addresses where the parent protocol is this protocol
    // this.#addresses = _context.addresses.filter(
    //   (address: YCAddress) => address.protocol()?.ID() == this.ID()
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

    return existingProtocol || null;
  };

  static instances: Map<string, YCProtocol> = new Map();
}
