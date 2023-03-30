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
  #chainid: number;
  #name: string;
  #logo: string;
  #color: string | undefined;
  #json_rpc: string | null = null; // init to null - network may not be integrated
  #provider: EthersJsonRpcProvider | null = null; // Init to null ^^^^
  #diamondAddress: string | null = null; // Init to null ^^^^^^^^^^
  #available: boolean = false;
  #protocols: YCProtocol[] = [];
  #fork: EthersJsonRpcProvider | null = null;
  #nativeToken: YCToken | null = null;
  #blockExplorer: string | null;

  // =====================
  //       METHODS
  // =====================

  get name(): string {
    return this.#name;
  }

  get logo(): string {
    return this.#logo;
  }

  get nativeToken(): YCToken | null {
    return this.#nativeToken;
  }

  get color(): string | undefined {
    return this.#color;
  }

  get blockExplorer(): string | undefined {
    return this.#blockExplorer || undefined;
  }

  // Get the chain ID
  get chainid(): number {
    return this.#chainid;
  }

  // Get all supported protocols that r on this chain
  get protocols(): YCProtocol[] {
    return this.#protocols;
  }

  get jsonrpc(): string | null {
    return this.#json_rpc;
  }

  // get current block number
  blocknumber = async (): Promise<number | null> => {
    if (!this.#available) {
      throw new Error(
        "YCNetwork ERROR: Cannot Get Block Number (Network Is Not Integrated - JSON RPC UNAVAILABLE)"
      );
    }

    return (await this.#provider?.getBlockNumber()) || null;
  };

  // Get the YC Diamond address on this chain
  ycDiamond = (): string | null => {
    return this.#diamondAddress || null;
  };

  // Ethers provider
  get provider(): EthersJsonRpcProvider {
    if (!this.#provider) {
      if (!this.#json_rpc)
        throw new Error(
          "YCNetwork ERR: Cannot Get Provider (Network Is Not Integrated - JSON RPC UNAVAILABLE). Network ID:" +
            this.chainid
        );
      return new ethers.JsonRpcProvider(this.#json_rpc);
    }
    return this.#provider;
  }

  // Fork the current chain
  fork = () => {
    if (!this.#available)
      throw new Error(
        "YCNetwork ERROR: Cannot Fork (Network Is Not Integrated - JSON RPC UNAVAILABLE)"
      );

    if (this.#fork) return this.#fork;

    // TODO: Add ganache fork
  };

  // Kill the current fork
  killFork = () => {
    if (!this.#available)
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
    this.#chainid = _network.id;
    this.#name = _network.name;
    this.#json_rpc = _network.json_rpc;
    this.#logo = _network.logo;
    this.#color = _network.color || undefined;
    this.#blockExplorer = _network.block_explorer || null;

    // Create new ethers provider
    if (this.#json_rpc) {
      this.#provider = new ethers.JsonRpcProvider(this.#json_rpc);
      this.#available = true;
    }

    // Init our native token
    if (_context) this.#initToken(_context);

    // // Get all protocols that r available on this network
    // this.#protocols = _context
    //   .protocolsNetworks()
    //   .flatMap(
    //     (protocolNetwork: {
    //       protocol_identifier: number;
    //       chain_id: number;
    //     }) => {
    //       if (protocolNetwork.chain_id == this.chainid()) {
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
        token_.chain_id == this.chainid && token_.address == ethers.ZeroAddress
    );
    // Set it globally
    if (token) this.#nativeToken = new YCToken(token, _context, this) || null;
  };

  // ============================
  //      ERRORS / ASSERTIONS
  // ============================
  assertSameChainID = (chainID?: bigint | SignerMethod): void => {
    if (!chainID || chainID !== BigInt(this.chainid || 0))
      throw new Error(
        "YCNetwork ERR: Inputted Chain ID does not match network's. Expected Chain ID: " +
          this.chainid +
          " Inputted Chain ID: " +
          chainID
      );
  };

  assertSignerChainID = async (signer?: SignerMethod): Promise<void> => {
    if (signer instanceof EthersExecutor)
      this.assertSameChainID((await signer?.provider?.getNetwork())?.chainId);
  };
}
