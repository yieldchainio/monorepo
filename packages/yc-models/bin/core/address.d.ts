import { Interface } from "ethers";
import { DBAddress } from "../types/db";
import { EthersContract } from "../types/ethers";
import { YCClassifications } from "./classification";
import YCFunc from "./function";
import YCProtocol from "./protocol";
export default class YCAddress {
    #private;
    constructor(_address: DBAddress, _context: YCClassifications);
    ID: () => number;
    address: () => string;
    functions: () => YCFunc[];
    interface: () => Interface;
    hasFunction: (_functionIdentifier: number) => boolean;
    protocol: () => YCProtocol | null;
    ABI: () => any;
    contract: () => EthersContract | null;
    bytecode: () => Promise<string | null>;
}
