import { ethers } from "ethers";
import { SignerMethod } from "../../types";
import { DBNetwork } from "../../types/db";
import { EthersExecutor, EthersJsonRpcProvider } from "../../types/ethers";
import { BaseClass } from "../base";
import { YCClassifications } from "../context/context";
import { YCProtocol } from "../protocol/protocol";
import { YCToken } from "../token/token";

/**
 * @YCNetwork
 */
export class YCNetwork extends BaseClass {
  // =====================
  //    PRIVATE FIELDS
  // =====================
  readonly id: number;
  readonly name: string;
  readonly logo: string;
  readonly color: string | undefined;
  readonly jsonRpc: string | null = null; // init to null - network may not be integrated
  #provider: EthersJsonRpcProvider | null = null; // Init to null ^^^^
  readonly diamondAddress: string | null = null; // Init to null ^^^^^^^^^^
  readonly available: boolean = false;
  readonly protocols: YCProtocol[] = [];
  #fork: EthersJsonRpcProvider | null = null;
  #nativeToken: YCToken | null = null;
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

  get nativeToken(): YCToken | null {
    return this.#nativeToken;
  }

  // Fork the current chain
  fork = () => {
    if (!this.available)
      throw new Error(
        "YCNetwork ERROR: Cannot Fork (Network Is Not Integrated - JSON RPC UNAVAILABLE)"
      );

    if (this.#fork) return this.#fork;

    // TODO: Add ganache fork
  };

  // Kill the current fork
  killFork = () => {
    if (!this.available)
      throw new Error(
        "YCNetwork ERROR: Fork Non-Existent (Network Is Not Integrated - JSON RPC UNAVAILABLE)"
      );

    if (!this.#fork) return true;

    // TODO: ADd ganache killing here
  };

  // =====================
  //     CONSTRUCTOR
  // =====================
  constructor(_network: DBNetwork, _context?: YCClassifications) {
    super();
    // Init static fields
    this.id = _network.id;
    this.name = _network.name;
    this.jsonRpc = _network.json_rpc;
    this.logo = _network.logo;
    this.color = _network.color || undefined;
    this.blockExplorer = _network.block_explorer || null;

    // Create new ethers provider
    if (this.jsonRpc) {
      this.#provider = new ethers.JsonRpcProvider(this.jsonRpc);
      this.available = true;
    }

    // Init our native token
    if (_context) this.#initToken(_context);

    const existingNetwork = this.getInstance(_network.id);
    if (existingNetwork) return existingNetwork;

    // // Get all protocols that r available on this network
    // this.#protocols = _context
    //   .protocolsNetworks()
    //   .flatMap(
    //     (protocolNetwork: {
    //       protocol_identifier: number;
    //       chain_id: number;
    //     }) => {
    //       if (protocolNetwork.chain_id == this.id()) {
    //         let protocolInstance = _context.getProtocol(
    //           protocolNetwork.protocol_identifier
    //         );
    //         if (protocolInstance) return protocolInstance;
    //       }
    //       return [];
    //     }
    //   );
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
  assertSameChainId = (id?: bigint | SignerMethod): void => {
    if (!id || id !== BigInt(this.id || 0))
      throw new Error(
        "YCNetwork ERR: Inputted Chain ID does not match network's. Expected Chain ID: " +
          this.id +
          " Inputted Chain ID: " +
          id
      );
  };

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
