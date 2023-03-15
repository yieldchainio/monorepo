import { ethers } from "ethers";
import { DBNetwork } from "../../types/db";
import { EthersJsonRpcProvider } from "../../types/ethers";
import { YCClassifications } from "../context/context";
import { YCProtocol } from "../protocol/protocol";

/**
 * @YCNetwork
 */
export class YCNetwork {
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

  // =====================
  //     CONSTRUCTOR
  // =====================
  constructor(_network: DBNetwork, _context?: YCClassifications) {
    // Init static fields
    this.#chainid = _network.id;
    this.#name = _network.name;
    this.#json_rpc = _network.json_rpc;
    this.#logo = _network.logo;
    this.#color = _network.color || undefined;

    // Create new ethers provider
    if (this.#json_rpc) {
      this.#provider = new ethers.JsonRpcProvider(this.#json_rpc);
      this.#available = true;
    }

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

  // =====================
  //       METHODS
  // =====================

  get name(): string {
    return this.#name;
  }

  get logo(): string {
    return this.#logo;
  }

  get color(): string | undefined {
    return this.#color;
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
  provider = (): EthersJsonRpcProvider => {
    if (!this.#provider) {
      if (!this.#json_rpc)
        throw new Error(
          "YCNetwork ERR: Cannot Get Provider (Network Is Not Integrated - JSON RPC UNAVAILABLE)"
        );
      return new ethers.JsonRpcProvider(this.#json_rpc);
    }
    return this.#provider;
  };

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
}
