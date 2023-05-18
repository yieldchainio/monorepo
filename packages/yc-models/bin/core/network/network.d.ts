import { SignerMethod, address } from "../../types/index.js";
import { DBNetwork } from "../../types/db.js";
import { EthersJsonRpcProvider } from "../../types/ethers.js";
import { BaseClass } from "../base/index.js";
import { YCClassifications } from "../context/context.js";
import { YCProtocol } from "../protocol/protocol.js";
import { YCToken } from "../token/token.js";
/**
 * @YCNetwork
 */
export declare class YCNetwork extends BaseClass {
    #private;
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
    get nativeToken(): YCToken | null;
    /**
     * Color of this network,
     * optional (used by frotnends)
     */
    readonly color: string | undefined;
    /**
     * The JSON RPC Url of this network,
     * can be null if the network is not fully integrated
     */
    readonly jsonRpc: string | null;
    /**
     * The address of the YC Diamond on this network, can be null.
     */
    readonly diamondAddress: address | null;
    /**
     * Whether this network is available currently or not
     */
    readonly available: boolean;
    /**
     * All of the protocols available on this network
     */
    readonly protocols: YCProtocol[];
    readonly blockExplorer: string | null;
    blocknumber: () => Promise<number | null>;
    ycDiamond: () => string | null;
    get provider(): EthersJsonRpcProvider;
    constructor(_network: DBNetwork, _context?: YCClassifications);
    /**
     * Assert an ID to be the same ID of this network
     * @param id - the ID to chck
     */
    assertSameChainId: (id?: bigint | SignerMethod) => void;
    /**
     * Assert tue chain ID of a signer to be the same as ours
     * @param signer - the signer to check and assert on
     */
    assertSignerChainID: (signer?: SignerMethod) => Promise<void>;
    getInstance: (id: number) => YCNetwork | null;
    static instances: Map<number, YCNetwork>;
    toJSON: () => DBNetwork;
}
