import { ethers, Interface } from "ethers";
var AddressTypes;
(function (AddressTypes) {
    AddressTypes[AddressTypes["ERC20"] = 0] = "ERC20";
    AddressTypes[AddressTypes["ERC721"] = 1] = "ERC721";
    AddressTypes[AddressTypes["NATIVE_CURRENCY"] = 2] = "NATIVE_CURRENCY";
    AddressTypes[AddressTypes["DEX"] = 3] = "DEX";
    AddressTypes[AddressTypes["LP_ROUTER"] = 4] = "LP_ROUTER";
    AddressTypes[AddressTypes["STAKING"] = 5] = "STAKING";
    AddressTypes[AddressTypes["LENDING"] = 6] = "LENDING";
    AddressTypes[AddressTypes["FUTURES"] = 7] = "FUTURES";
    AddressTypes[AddressTypes["UNKNOWN"] = 8] = "UNKNOWN";
})(AddressTypes || (AddressTypes = {}));
export default class YCAddress {
    // ====================
    //    PRIVATE FIELDS
    // ====================
    #identifier;
    #address;
    #abi;
    #network = null; // Initiate to null
    #protocol = null;
    #functions = [];
    #type = AddressTypes.UNKNOWN; // Init to unknown
    // ====================
    //     CONSTRUCTOR
    // ====================
    constructor(_address, _context) {
        this.#identifier = _address.address_identifier;
        this.#address = _address.contract_address;
        this.#abi = _address.abi;
        this.#network =
            _context
                .networks()
                .find((network) => network.chainid == _address.chain_id) ||
                null;
        // let protocol = _context
        //   .protocolsAddresses()
        //   .find(
        //     (protocolAddress: {
        //       protocol_identifier: number;
        //       address_identifier: number;
        //     }) => protocolAddress.address_identifier == this.ID()
        //   );
        // if (protocol)
        //   this.#protocol = _context.getProtocol(protocol.protocol_identifier);
        for (const func of _address.functions) {
            let currFunc = _context.getFunction(func);
            if (!currFunc)
                throw new Error("YCAddress ERR: Function Not Found!, Function ID: " + func);
            this.#functions.push(currFunc);
        }
    }
    // ====================
    //      METHODS
    // ====================
    // Return the identifier of the current address
    ID = () => {
        return this.#identifier;
    };
    // Return the checksum address
    address = () => {
        return ethers.getAddress(this.#address);
    };
    // Functions on this address that we classified
    functions = () => {
        return this.#functions;
    };
    // Ethers ABI inteface
    interface = () => {
        return new Interface(this.#abi);
    };
    // Check if a function is avaiable on this address
    hasFunction = (_functionIdentifier) => {
        return this.#functions.some((func) => func.ID() == _functionIdentifier);
    };
    // Return the parent protocol of the address
    protocol = () => {
        return this.#protocol;
    };
    // Return the ABI of the contract
    ABI = () => {
        return this.#abi;
    };
    // Get an ethers contract object
    contract = () => {
        if (!this.#network)
            return null;
        return new ethers.Contract(this.address(), this.ABI(), this.#network.provider());
    };
    // Get the bytecode of this address
    bytecode = async () => {
        return (await this.contract()?.getDeployedCode()) || null;
    };
}
//# sourceMappingURL=address.js.map