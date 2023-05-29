import { Contract, Interface } from "ethers";
import { DBContract } from "../../types/db.js";
import { YCClassifications } from "../context/context.js";
import { YCFunc } from "../function/function.js";
import { YCNetwork } from "../network/network.js";
import { YCProtocol } from "../protocol/protocol.js";
import { BaseClass } from "../base/index.js";
export declare class YCContract extends BaseClass {
    /**
     * ID of this contract (uuid)
     */
    readonly id: string;
    /**
     * Address of this contract (e.g 0x0...00)
     */
    readonly address: string;
    /**
     * The ABI of this contract (Fragments of all functions, events, etc)
     */
    readonly abi: any;
    /**
     * The network this contract is on
     */
    readonly network: YCNetwork | null;
    /**
     * The protocol this contract belongs to (e.g, Uniswap DEX contract belongs to Uniswap)
     */
    readonly protocol: YCProtocol | null;
    /**
     * All of the classified functions under this contract
     */
    readonly functions: YCFunc[];
    /**
     * An ethers.js contract object, for interacting with this contract
     */
    readonly contract: Contract;
    /**
     * An ethers.js interface object, for encoding/decoding-related operations on the contract
     * (basically, the ABI with some methods on it)
     */
    readonly interface: Interface;
    /**
     * The addresses relating to this one
     */
    readonly relatedContracts: YCContract[];
    static diamondIdentifier: string;
    constructor(_address: DBContract, _context: YCClassifications);
    /**
     * hasFunction
     * Check if this contract includes some function ID.
     * We search on our functions array as if it is either YCFuncs or strings.
     * Because in the construction, we have some time where the functions are the IDs
     * in order to avoid limbos & correct comparisons.
     * @param functionID - the ID of the function to look for
     * @returns boolean
     */
    hasFunction: (functionID: string) => boolean;
    /**
     * Get the bytecode of this contract in real time
     * @returns bytecode | null
     */
    bytecode: () => Promise<string | null>;
    getInstance: (id: string) => YCContract | null;
    static instances: Map<string, YCContract>;
}
