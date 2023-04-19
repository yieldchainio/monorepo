import { DBProtocol } from "../../types/db";
import { YCClassifications } from "../context/context";
import { YCSocialMedia } from "../social-media/social-media";
import { BaseClass } from "../base";
import { ProtocolType } from "@prisma/client";
import { YCNetwork } from "../network/network";
import { YCAddress, YCToken } from "..";

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
  readonly type: ProtocolType;
  readonly available: boolean;
  readonly addresses: YCAddress[] = [];
  readonly color: string | null = null;

  // =======================
  //     UNIQUE FIELDS
  // ======================
  readonly tokens: YCToken[] = [];
  readonly networks: YCNetwork[] = [];
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

    this.type = _protocol.type;

    this.available = _protocol.available;

    this.color = _protocol.color;

    /**
     * @notice
     * We set it to the IDs here before gettng our instance so that it matches in stringification, without an infinite limbo.
     * we set it to the actual networks afterwards
     */
    this.networks = _protocol.chain_ids as unknown as YCNetwork[];
    this.addresses = _protocol.address_ids as unknown as YCAddress[];

    const existingProtocol = this.getInstance(_protocol.id);
    if (existingProtocol) return existingProtocol;

    this.networks = (this.networks as unknown as number[]).flatMap(
      (networkID: number) => {
        const network = _context.getNetwork(networkID);
        return network ? [network] : [];
      }
    );

    this.addresses = (this.addresses as unknown as string[]).flatMap(
      (addressID: string) => {
        const address = _context.getAddress(addressID);
        console.log(
          `Got An Address for ${_protocol.name} : ${address?.address}, The origianl one: ${addressID}`
        );
        return address ? [address] : [];
      }
    );

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

  // Custom toJSON
  toJSON = (): DBProtocol => {
    return {
      id: this.id,
      name: this.name,
      logo: this.logo,
      available: this.available,
      website: this.website,
      color: this.color,
      chain_ids: this.networks.map((network) => network.id),
      address_ids: this.addresses.map((address) => address.id),
      type: this.type,
      twitter: this.socialMedia.twitter.link || "",
      discord: this.socialMedia.discord.link || "",
      telegram: this.socialMedia.telegram.link || "",
    };
  };
}
