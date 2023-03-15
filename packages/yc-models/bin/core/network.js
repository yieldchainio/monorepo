import { ethers } from "ethers";
export default class YCNetwork {
    // =====================
    //    PRIVATE FIELDS
    // =====================
    #chainid;
    #name;
    #logo;
    #json_rpc = null; // init to null - network may not be integrated
    #provider = null; // Init to null ^^^^
    #diamondAddress = null; // Init to null ^^^^^^^^^^
    #available = false;
    #protocols = [];
    #fork = null;
    // =====================
    //     CONSTRUCTOR
    // =====================
    constructor(_network, _context) {
        // Init static fields
        this.#chainid = _network.chain_id;
        this.#name = _network.name;
        this.#json_rpc = _network.json_rpc;
        this.#logo = _network.logo;
        // Create new ethers provider
        if (this.#json_rpc)
            this.#provider = new ethers.JsonRpcProvider(this.#json_rpc);
        this.#available = true;
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
    get name() {
        return this.#name;
    }
    get logo() {
        return this.#logo;
    }
    // Get the chain ID
    get chainid() {
        return this.#chainid;
    }
    // Get all supported protocols that r on this chain
    get protocols() {
        return this.#protocols;
    }
    get jsonrpc() {
        return this.#json_rpc;
    }
    // get current block number
    blocknumber = async () => {
        if (!this.#available) {
            throw new Error("YCNetwork ERROR: Cannot Get Block Number (Network Is Not Integrated - JSON RPC UNAVAILABLE)");
        }
        return (await this.#provider?.getBlockNumber()) || null;
    };
    // Get the YC Diamond address on this chain
    ycDiamond = () => {
        return this.#diamondAddress || null;
    };
    // Ethers provider
    provider = () => {
        if (!this.#provider) {
            if (!this.#json_rpc)
                throw new Error("YCNetwork ERR: Cannot Get Provider (Network Is Not Integrated - JSON RPC UNAVAILABLE)");
            return new ethers.JsonRpcProvider(this.#json_rpc);
        }
        return this.#provider;
    };
    // Fork the current chain
    fork = () => {
        if (!this.#available)
            throw new Error("YCNetwork ERROR: Cannot Fork (Network Is Not Integrated - JSON RPC UNAVAILABLE)");
        if (this.#fork)
            return this.#fork;
        // TODO: Add ganache fork
    };
    // Kill the current fork
    killFork = () => {
        if (!this.#available)
            throw new Error("YCNetwork ERROR: Fork Non-Existent (Network Is Not Integrated - JSON RPC UNAVAILABLE)");
        if (!this.#fork)
            return true;
        // TODO: ADd ganache killing here
    };
}
//# sourceMappingURL=network.js.map