import { Contract, ethers, Interface, InterfaceAbi } from "ethers";
import { DBContract } from "../../types/db";
import { EthersContract } from "../../types/ethers";
import { YCClassifications } from "../context/context";
import { YCFunc } from "../function/function";
import { YCNetwork } from "../network/network";
import { YCProtocol } from "../protocol/protocol";
import { BaseClass } from "../base";

export class YCContract extends BaseClass {
  // ================
  //      FIELDS
  // ================
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
  readonly network: YCNetwork | null = null; // Initiate to null

  /**
   * The protocol this contract belongs to (e.g, Uniswap DEX contract belongs to Uniswap)
   */
  readonly protocol: YCProtocol | null = null;

  /**
   * All of the classified functions under this contract
   */
  readonly functions: YCFunc[] = [];

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
  readonly relatedContracts: YCContract[] = [];

  // ====================
  //     CONSTRUCTOR
  // ====================
  constructor(_address: DBContract, _context: YCClassifications) {
    /**
     * Ser the srtatic vars
     */
    super();
    this.id = _address.id;
    this.address = _address.address;
    this.abi = (_address.abi as any[] | null)?.filter(
      (fragment) => Object.keys(fragment).length > 0
    );
    this.network = _context.getNetwork(_address.chain_id);
    this.protocol = _address.protocol_id as unknown as YCProtocol;

    /**
     * We set some contex-related variables as the string ID first before attemtping to get existing singleton instances.
     * This is done in order for the comparison function to see our fields correctly, since it would have
     * converted the instances into IDs anyway.
     */
    this.functions = _address.functions_ids as unknown as YCFunc[];
    this.contract = new ethers.Contract(
      this.address,
      this.abi,
      this.network?.provider
    );
    this.relatedContracts =
      _address.related_contracts as unknown as YCContract[];

    this.interface = new Interface(this.abi);

    // Get the existing instance (or set ours otherwise)
    const existingAddress = this.getInstance(_address.id);
    if (existingAddress) return existingAddress;

    console.log("Address Object", _address);
    this.relatedContracts = _context.rawAddresses.flatMap((jsonContract) => {
      const exists = _address.related_contracts.some(
        (relatedContractID) => relatedContractID == jsonContract.id
      );
      return exists ? [new YCContract(jsonContract, _context)] : [];
    });
    this.protocol = _context.getProtocol(_address.protocol_id);

    // Set the actual (circular) values
    this.functions = (_address.functions_ids as unknown as string[]).flatMap(
      (func) => {
        const res = _context.getFunction(func);
        return res ? [res] : [];
      }
    );
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
  hasFunction = (functionID: string): boolean => {
    return this.functions.some(
      (func: YCFunc) =>
        func.id == functionID || (func as unknown as string) === functionID // @notice. This is for the constructor thing
    );
  };

  /**
   * Get the bytecode of this contract in real time
   * @returns bytecode | null
   */
  bytecode = async (): Promise<string | null> => {
    return (await this.contract?.getDeployedCode()) || null;
  };

  // =================
  //   SINGLETON REF
  // =================
  getInstance = (id: string): YCContract | null => {
    // We try to find an existing instance of this user
    const existingUser = YCContract.instances.get(id);

    // If we have an existing user and it has the same fields as this one, we return the singleton of it
    if (existingUser) {
      if (this.compare(existingUser)) return existingUser;
    }

    YCContract.instances.set(id, this);

    return null;
  };

  static instances: Map<string, YCContract> = new Map();
}
