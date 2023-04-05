import { Contract, ethers, Interface, InterfaceAbi } from "ethers";
import { DBAddress } from "../../types/db";
import { EthersContract } from "../../types/ethers";
import { YCClassifications } from "../context/context";
import { YCFunc } from "../function/function";
import { YCNetwork } from "../network/network";
import { YCProtocol } from "../protocol/protocol";
import { BaseClass } from "../base";

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

export class YCAddress extends BaseClass {
  // ====================
  //    PRIVATE FIELDS
  // ====================
  id: string;
  address: string;
  abi: any;
  network: YCNetwork | null = null; // Initiate to null
  protocol: YCProtocol | null = null;
  functions: YCFunc[] = [];
  type: AddressTypes = AddressTypes.UNKNOWN; // Init to unknown
  contract: Contract;
  interface: Interface;

  // ====================
  //     CONSTRUCTOR
  // ====================
  constructor(_address: DBAddress, _context: YCClassifications) {
    super();
    this.id = _address.id;
    this.address = _address.address;
    this.abi = (_address.abi as any[] | null)?.filter(
      (fragment) => Object.keys(fragment).length > 0
    );
    this.network = _context.getNetwork(_address.chain_id);

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

    /**
     * We set it as the string ID first before attemtping to get an existing singleton instance.
     * This is done in order for the comparison function to see our fields correctly, since it would have
     * converted the instances into IDs anyway.
     */
    for (const func of _address.functions_ids) {
      this.functions.push(func as unknown as YCFunc);
    }

    this.contract = new ethers.Contract(
      this.address,
      this.abi,
      this.network?.provider
    );
    this.interface = new Interface(this.abi);

    // Get the existing instance (or set ours otherwise)
    const existingAddress = this.getInstance(_address.id);
    if (existingAddress) return existingAddress;

    // Set the actual (circular) values
    this.functions = [];
    for (const func of _address.functions_ids) {
      let currFunc = _context.getFunction(func);
      if (!currFunc)
        throw new Error(
          "YCAddress ERR: Function Not Found!, Function ID: " + func
        );
      this.functions.push(currFunc);
    }
  }

  // ====================
  //      METHODS
  // ====================

  // Check if a function is avaiable on this address
  hasFunction = (_functionIdentifier: string) => {
    return this.functions.some(
      (func: YCFunc) =>
        func.id == _functionIdentifier ||
        (func as unknown as string) === _functionIdentifier // @notice. This is for the constructor thing
    );
  };

  // Get the bytecode of this address
  bytecode = async (): Promise<string | null> => {
    return (await this.contract?.getDeployedCode()) || null;
  };

  // =================
  //   SINGLETON REF
  // =================
  getInstance = (id: string): YCAddress | null => {
    // We try to find an existing instance of this user
    const existingUser = YCAddress.instances.get(id);

    // If we have an existing user and it has the same fields as this one, we return the singleton of it
    if (existingUser) {
      if (this.compare(existingUser)) return existingUser;
    }

    YCAddress.instances.set(id, this);

    return existingUser || null;
  };

  static instances: Map<string, YCAddress> = new Map();
}
