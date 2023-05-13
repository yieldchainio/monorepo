import { ethers, Interface } from "ethers";
import { BaseClass } from "../base/index.js";
class YCContract extends BaseClass {
    // ================
    //      FIELDS
    // ================
    /**
     * ID of this contract (uuid)
     */
    id;
    /**
     * Address of this contract (e.g 0x0...00)
     */
    address;
    /**
     * The ABI of this contract (Fragments of all functions, events, etc)
     */
    abi;
    /**
     * The network this contract is on
     */
    network = null; // Initiate to null
    /**
     * The protocol this contract belongs to (e.g, Uniswap DEX contract belongs to Uniswap)
     */
    protocol = null;
    /**
     * All of the classified functions under this contract
     */
    functions = [];
    /**
     * An ethers.js contract object, for interacting with this contract
     */
    contract;
    /**
     * An ethers.js interface object, for encoding/decoding-related operations on the contract
     * (basically, the ABI with some methods on it)
     */
    interface;
    /**
     * The addresses relating to this one
     */
    relatedContracts = [];
    // ====================
    //     CONSTRUCTOR
    // ====================
    constructor(_address, _context) {
        /**
         * Ser the srtatic vars
         */
        super();
        this.id = _address.id;
        this.address = _address.address;
        this.abi = _address.abi?.filter((fragment) => Object.keys(fragment).length > 0);
        this.network = _context.getNetwork(_address.chain_id);
        this.protocol = _address.protocol_id;
        /**
         * We set some contex-related variables as the string ID first before attemtping to get existing singleton instances.
         * This is done in order for the comparison function to see our fields correctly, since it would have
         * converted the instances into IDs anyway.
         */
        this.functions = _address.functions_ids;
        this.contract = new ethers.Contract(this.address, this.abi, this.network?.provider);
        this.relatedContracts =
            _address.related_contracts;
        this.interface = new Interface(this.abi);
        // Get the existing instance (or set ours otherwise)
        const existingAddress = this.getInstance(_address.id);
        if (existingAddress)
            return existingAddress;
        console.log("Address Object", _address);
        this.relatedContracts = _context.rawAddresses.flatMap((jsonContract) => {
            const exists = _address.related_contracts.some((relatedContractID) => relatedContractID == jsonContract.id);
            return exists ? [new YCContract(jsonContract, _context)] : [];
        });
        this.protocol = _context.getProtocol(_address.protocol_id);
        // Set the actual (circular) values
        this.functions = _address.functions_ids.flatMap((func) => {
            const res = _context.getFunction(func);
            return res ? [res] : [];
        });
    }
    // ====================
    //      METHODS
    // ====================
    /**
     * hasFunction
     * Check if this contract includes some function ID.
     * We search on our functions array as if it is either YCFuncs or strings.
     * Because in the construction, we have some time where the functions are the IDs
     * in order to avoid limbos & correct comparisons.
     * @param functionID - the ID of the function to look for
     * @returns boolean
     */
    hasFunction = (functionID) => {
        return this.functions.some((func) => func.id == functionID || func === functionID // @notice. This is for the constructor thing
        );
    };
    /**
     * Get the bytecode of this contract in real time
     * @returns bytecode | null
     */
    bytecode = async () => {
        return (await this.contract?.getDeployedCode()) || null;
    };
    // =================
    //   SINGLETON REF
    // =================
    getInstance = (id) => {
        // We try to find an existing instance of this user
        const existingUser = YCContract.instances.get(id);
        // If we have an existing user and it has the same fields as this one, we return the singleton of it
        if (existingUser) {
            if (this.compare(existingUser))
                return existingUser;
        }
        YCContract.instances.set(id, this);
        return null;
    };
    static instances = new Map();
}
export { YCContract };
//# sourceMappingURL=address.js.map