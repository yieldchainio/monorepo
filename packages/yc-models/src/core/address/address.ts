import { ethers, Interface } from "ethers";
import { DBAddress } from "../../types/db";
import { EthersContract } from "../../types/ethers";
import { YCClassifications } from "../context/context";
import { YCFunc } from "../function/function";
import { YCNetwork } from "../network/network";
import { YCProtocol } from "../protocol/protocol";

enum AddressTypes {
  ERC20,
  ERC721,
  NATIVE_CURRENCY,
  DEX,
  LP_ROUTER,
  STAKING,
  LENDING,
  FUTURES,
  UNKNOWN,
}

export class YCAddress {
  // ====================
  //    PRIVATE FIELDS
  // ====================
  #identifier: string;
  #address: string;
  #abi: any;
  #network: YCNetwork | null = null; // Initiate to null
  #protocol: YCProtocol | null = null;
  #functions: YCFunc[] = [];
  #type: AddressTypes = AddressTypes.UNKNOWN; // Init to unknown

  // ====================
  //     CONSTRUCTOR
  // ====================
  constructor(_address: DBAddress, _context: YCClassifications) {
    this.#identifier = _address.id;
    this.#address = _address.address;
    this.#abi = _address.abi;
    this.#network =
      _context.networks.find(
        (network: YCNetwork) => network.chainid == _address.chain_id
      ) || null;

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

    for (const func of _address.functions_ids) {
      let currFunc = _context.getFunction(func);
      if (!currFunc)
        throw new Error(
          "YCAddress ERR: Function Not Found!, Function ID: " + func
        );
      this.#functions.push(currFunc);
    }
  }

  // ====================
  //      METHODS
  // ====================

  // Return the identifier of the current address
  get id(): string {
    return this.#identifier;
  }

  // Return the checksum address
  get address(): string {
    return ethers.getAddress(this.#address);
  }

  // Functions on this address that we classified
  get functions(): YCFunc[] {
    return this.#functions;
  }

  // Ethers ABI inteface
  get interface(): Interface {
    return new Interface(this.#abi);
  }

  // Check if a function is avaiable on this address
  hasFunction = (_functionIdentifier: string) => {
    return this.#functions.some(
      (func: YCFunc) => func.ID() == _functionIdentifier
    );
  };

  // Return the parent protocol of the address
  get protocol(): YCProtocol | null {
    return this.#protocol;
  }

  // Return the ABI of the contract
  get ABI(): any {
    return this.#abi;
  }

  // Get an ethers contract object
  get contract(): EthersContract | null {
    if (!this.#network) return null;
    return new ethers.Contract(
      this.address,
      this.ABI(),
      this.#network.provider
    );
  }

  // Get the bytecode of this address
  bytecode = async (): Promise<string | null> => {
    return (await this.contract?.getDeployedCode()) || null;
  };
}
