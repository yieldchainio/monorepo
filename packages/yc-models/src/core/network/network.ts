import { ethers } from "ethers";
import { SignerMethod, address } from "../../types/index.js";
import { DBNetwork } from "../../types/db.js";
import { EthersExecutor, EthersJsonRpcProvider } from "../../types/ethers.js";
import { BaseClass } from "../base/index.js";
import { YCClassifications } from "../context/context.js";
import { YCProtocol } from "../protocol/protocol.js";
import { YCToken } from "../token/token.js";

/**
 * @YCNetwork
 */
export class YCNetwork extends BaseClass {
  // =====================
  //       FIELDS
  // =====================

  /**
   * The ID of this network (Chain ID)
   */
  readonly id: number;

  /**
   * The name of this network (Ethereum, Arbitrum, etc)
   */
  readonly name: string;

  /**
   * The logo URI of this network
   */
  readonly logo: string;

  /**
   * The native token of this network (e.g ETH for ethereum, FTM for Fantom)
   */
  #nativeToken: YCToken | null = null;
  get nativeToken(): YCToken | null {
    return this.#nativeToken;
  }

  /**
   * Color of this network,
   * optional (used by frotnends)
   */
  readonly color: string | undefined;

  /**
   * The JSON RPC Url of this network,
   * can be null if the network is not fully integrated
   */
  readonly jsonRpc: string | null = null; // init to null - network may not be integrated

  /**
   * The address of the YC Diamond on this network, can be null.
   */
  readonly diamondAddress: address | null = null; // Init to null ^^^^^^^^^^

  /**
   * Whether this network is available currently or not
   */
  readonly available: boolean = false;

  /**
   * All of the protocols available on this network
   */
  readonly protocols: YCProtocol[] = [];

  /**
   * A cached ethers.js provider object for interacting with this network through JSON RPC methods
   */
  #provider: EthersJsonRpcProvider | null = null; // Init to null ^^^^

  /**
   * A cached provider like the above but of a fork
   */
  #fork: EthersJsonRpcProvider | null = null;

  readonly blockExplorer: string | null;

  // =====================
  //       METHODS
  // =====================

  // get current block number
  blocknumber = async (): Promise<number | null> => {
    if (!this.available) {
      throw new Error(
        "YCNetwork ERROR: Cannot Get Block Number (Network Is Not Integrated - JSON RPC UNAVAILABLE)"
      );
    }

    return (await this.provider?.getBlockNumber()) || null;
  };

  // Get the YC Diamond address on this chain
  ycDiamond = (): string | null => {
    return this.diamondAddress || null;
  };

  // Ethers provider
  get provider(): EthersJsonRpcProvider {
    if (!this.#provider) {
      if (!this.jsonRpc)
        throw new Error(
          "YCNetwork ERR: Cannot Get Provider (Network Is Not Integrated - JSON RPC UNAVAILABLE). Network ID:" +
            this.id
        );
      return new ethers.JsonRpcProvider(this.jsonRpc);
    }
    return this.#provider;
  }

  // =====================
  //     CONSTRUCTOR
  // =====================
  constructor(_network: DBNetwork, _context?: YCClassifications) {
    /**
     * Initiate static vars
     */
    super();
    this.id = _network.id;
    this.name = _network.name;
    this.jsonRpc = _network.json_rpc;
    this.logo = _network.logo;
    this.color = _network.color || undefined;
    this.blockExplorer = _network.block_explorer || null;
    this.diamondAddress = _network.diamond_address as address | null;

    /**
     * Initiate the ethers provider if we have a json rpc available
     */
    if (this.jsonRpc) {
      this.#provider = new ethers.JsonRpcProvider(this.jsonRpc);
      this.available = true;
    }

    /**
     * Initiate our native token by finding a zero-address token on our network
     */
    if (_context) this.#initToken(_context);

    /**
     * Return singleton if viable
     */
    const existingNetwork = this.getInstance(_network.id);
    if (existingNetwork) return existingNetwork;
  }

  // ======================
  //   INTERNAL METHODS
  // ======================
  #initToken = async (_context: YCClassifications) => {
    // Initiallize the context if not already
    if (!_context.initiallized) await _context.initiallize();
    // Find our native token by inputting the 0x00..00 address and our chain id
    const token = _context.rawTokens.find(
      (token_) =>
        token_.chain_id == this.id && token_.address == ethers.ZeroAddress
    );
    // Set it globally
    if (token) this.#nativeToken = new YCToken(token, _context, this) || null;
  };

  // ============================
  //      ERRORS / ASSERTIONS
  // ============================

  /**
   * Assert an ID to be the same ID of this network
   * @param id - the ID to chck
   */
  assertSameChainId = (id?: bigint | SignerMethod): void => {
    if (!id || id !== BigInt(this.id || 0))
      throw new Error(
        "YCNetwork ERR: Inputted Chain ID does not match network's. Expected Chain ID: " +
          this.id +
          " Inputted Chain ID: " +
          id
      );
  };

  /**
   * Assert tue chain ID of a signer to be the same as ours
   * @param signer - the signer to check and assert on
   */
  assertSignerChainID = async (signer?: SignerMethod): Promise<void> => {
    if (signer instanceof EthersExecutor)
      this.assertSameChainId((await signer?.provider?.getNetwork())?.chainId);
  };

  // =================
  //   SINGLETON REF
  // =================
  getInstance = (id: number): YCNetwork | null => {
    // We try to find an existing instance of this user
    const existingNetwork = YCNetwork.instances.get(id);

    // If we have an existing user and it has the same fields as this one, we return the singleton of it
    if (existingNetwork) {
      if (this.compare(existingNetwork)) return existingNetwork;
    }

    YCNetwork.instances.set(id, this);

    return null;
  };

  static instances: Map<number, YCNetwork> = new Map();

  // =======================
  //    UTILITY METHODS
  // =======================
  toJSON = (): DBNetwork => {
    return {
      id: this.id,
      name: this.name,
      json_rpc: this.jsonRpc || "",
      logo: this.logo,
      color: this.color || "",
      block_explorer: this.blockExplorer,
      diamond_address: this.diamondAddress,
    };
  };
}
