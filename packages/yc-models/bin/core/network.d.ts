import { DBNetwork } from "../types/db";
import { EthersJsonRpcProvider } from "../types/ethers";
import { YCClassifications } from "./classification";
import YCProtocol from "./protocol";
export default class YCNetwork {
    #private;
    constructor(_network: DBNetwork, _context: YCClassifications);
    get name(): string;
    get logo(): string;
    get chainid(): number;
    get protocols(): YCProtocol[];
    get jsonrpc(): string | null;
    blocknumber: () => Promise<number | null>;
    ycDiamond: () => string | null;
    provider: () => EthersJsonRpcProvider;
    fork: () => EthersJsonRpcProvider | undefined;
    killFork: () => true | undefined;
}
