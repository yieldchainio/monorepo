import { DBArgument, DBFunction, JSONStep } from "../../types/db.js";
import { YCClassifications } from "../context/context.js";
import { YCContract } from "../address/address.js";
import { YCArgument } from "../argument/argument.js";
import {
  FunctionCallStruct,
  EncodingContext,
  TokenPercentage,
} from "../../types/index.js";
import { Typeflags } from "@prisma/client";
import { BaseClass } from "../base/index.js";
import { YCAction } from "../action/action.js";
import { YCToken } from "../token/token.js";
import { getFunctionFlags } from "../../helpers/builder/get-command-flags.js";
import { bytes } from "../../types/index.js";
import { uuidV4 } from "ethers";
import { v4 as uuid } from "uuid";

export class YCFunc extends BaseClass {
  // ====================
  //    STATIC FIELDS
  // ====================

  // The signature used to encode/decode the FunctionCallStruct struct - i.e a tuple representing it's fields
  static readonly FunctionCallTuple =
    "tuple(address target_address, bytes[] args, string signature)";

  // ====================
  //    PRIVATE FIELDS
  // ====================
  instanceID: string;
  readonly id: string;
  readonly name: string;
  readonly address: YCContract | null;
  readonly actions: YCAction[] = [];
  readonly isCallback: boolean;
  readonly counterFunction: YCFunc | null;
  readonly dependencyFunction: YCFunc | null;
  readonly outflows: YCToken[] = [];
  readonly inflows: YCToken[] = [];
  readonly signature: string;
  readonly typeflag: Typeflags;
  readonly retTypeflag: Typeflags;
  #arguments: YCArgument[];
  get arguments() {
    return this.#arguments;
  }
  readonly copyArgs: boolean;

  // ====================
  //     CONSTRUCTOR
  // ====================
  constructor(
    _function: DBFunction,
    _context: YCClassifications,
    forceNewInstance: boolean = false
  ) {
    super();
    // Static variables
    this.id = _function.id;
    this.name = _function.name;
    this.typeflag = _function.typeflag;
    this.retTypeflag = _function.ret_typeflag;
    this.isCallback = _function.callback;
    this.copyArgs = _function.copy_args;
    this.instanceID = uuid();

    // Mapping arg identifiers => Full argument instances
    const fullArgs = _function.arguments_ids.map(
      (_arg: string | DBArgument) => {
        if (this.id == "dbea21b6-8baa-4bc5-9f68-8ed33ca1c692")
          console.log(
            "Mapping Arg For Add Liquidity... Typeof Arg:",
            typeof _arg,
            "Arg:",
            _arg
          );
        if (typeof _arg == "object") return new YCArgument(_arg, _context);
        const jsonArg = _context.rawArguments.find((arg) => arg.id == _arg);
        return jsonArg ? new YCArgument(jsonArg, _context) : null;
      }
    );

    // Throw an error and assign no arguments if the arguments include a null value
    if (fullArgs.includes(null)) {
      throw (
        "YCFunc ERROR: Found Null Argument. Argument Value: " +
        fullArgs.find((arg: YCArgument | null) => arg == null)
      );
    }
    // Should be sufficient anyway - Typescript whining for no reason.
    else
      this.#arguments = fullArgs.flatMap((arg: YCArgument | null) =>
        arg !== null ? [arg] : []
      );

    // Create signature
    this.signature = _function.signature;

    const address: YCContract | null = _context.getAddress(
      _function.address_id
    );

    if (!address)
      throw new Error("YCFunc ERR: Address Not Found! Func ID: " + this.id);

    this.address = address;

    // Add ourselves to our address if not yet
    if (!this.address.functions.find((func) => func.id == this.id))
      this.address.functions.push(this);

    /**
     * We set it as the string ID first before attemtping to get an existing singleton instance.
     * This is done in order for the comparison function to see our fields correctly, since it would have
     * converted the instances into IDs anyway.
     */
    this.counterFunction = _function.inverse_function_id as unknown as YCFunc;
    this.dependencyFunction =
      _function.dependancy_function_id as unknown as YCFunc;

    this.outflows = _function.outflows as unknown as YCToken[];
    this.inflows = _function.inflows as unknown as YCToken[];
    this.actions = (_function.actions_ids || []) as unknown as YCAction[];

    // Get the existing instance (or set ours otherwise)
    const existingFunc = this.getInstance(_function.id);
    if (existingFunc && !forceNewInstance) return existingFunc;

    // Set the actual dependency/counter functions
    this.counterFunction = _function.inverse_function_id
      ? _context.getFunction(_function.inverse_function_id)
      : null;
    this.dependencyFunction = _function.dependancy_function_id
      ? _context.getFunction(_function.dependancy_function_id)
      : null;

    this.actions = (_function.actions_ids || []).flatMap((actionID: string) => {
      const action = _context.getAction(actionID);
      return action ? [action] : [];
    });

    // Mapping flow identifiers => Full Flows intances
    this.outflows = _function.outflows.flatMap((_tokenID: string) => {
      let token = _context.getToken(_tokenID);
      if (token) return [token];
      return [];
    });
    this.inflows = _function.inflows.flatMap((_tokenID: string) => {
      let token = _context.getToken(_tokenID);
      if (token) return [token];
      return [];
    });
  }

  // =========================
  //    GENERATION METHODS
  // =========================
  // Encode the current function as a FunctionCallStruct struct, add flag
  encodeYCCommand = (
    step: JSONStep,
    context: EncodingContext,
    customArguments: Array<any | YCFunc>
  ): bytes => {
    if (!this.address)
      throw new Error(
        "YCFunc ERR: Cannot Encode - Address Not Found. Function ID: " + this.id
      );

    // Ethers interface for encoding
    const iface = this.address.interface;

    // FunctionCallStruct struct that will be ncoded
    const functionCall: FunctionCallStruct = this.toFunctionCallStruct(
      step,
      context,
      customArguments
    );

    // get the flag'ified encoded FunctionCallStruct
    const flags = getFunctionFlags(this);

    // Encode the function call
    const encodedFunction = iface
      .getAbiCoder()
      .encode([YCFunc.FunctionCallTuple], [functionCall]);

    // Return the encoded function with the flag
    return "0x" + flags + encodedFunction.slice(2, encodedFunction.length);
  };

  /**
   * @method toFunctionCallStruct
   * @param customArguments - Custom arguments that should be provided if the function requires any.
   * @returns A @interface FunctionCallStruct that represents an on-chain FunctionCallStruct struct.
   */
  toFunctionCallStruct = (
    step: JSONStep,
    context: EncodingContext,
    customArguments: Array<string | null>
  ): FunctionCallStruct => {
    // Assert that if we require a custom argument,
    if (this.customArgumentsLength > customArguments.length)
      throw new Error(
        "YCFunc ERR: Cannot Create FunctionCallStruct - Function requires custom argument(s?), but provided args length insufficient. Function: " +
          this.name +
          " ID: " +
          this.id +
          " Custom Args Required: " +
          this.customArgumentsLength +
          " Custom Args Provided: " +
          customArguments.length
      );

    // Assert that we must have an address set
    if (!this.address)
      throw new Error(
        "YCFuncERR: Cannot Create FunctionCallStruct - Function Does Not Have An Address."
      );

    const network = YCClassifications.getInstance().getNetwork(step.chainId);
    if (!network?.diamondAddress)
      throw (
        "Cannot Encode A Function When Diamond Address Is Undefined. Network: " +
        network?.id +
        " Function Name: " +
        this.name
      );
    const address =
      this.address.id == YCContract.diamondIdentifier
        ? network.diamondAddress
        : this.address.address;

    // Create the struct
    const struct: FunctionCallStruct = {
      // The target address (our address, tells the onchain interpreter where to call the function)
      target_address: address,

      // Our arguments. If an argument is not a custom, we encode it. Otherwise, we encode it but
      // input the next custom argument from our array (we shift is so that it is removed)
      args: this.arguments.map((arg: YCArgument) =>
        arg.encodeYCCommand(
          step,
          context,
          arg.isCustom ? customArguments.shift() : undefined
        )
      ),

      // Our signature (i.e "stakeTokens(uint256,address,string)")
      signature: this.signature,
    };

    return struct;
  };

  // Returns true if the function requires a custom argument
  get requiresCustom(): boolean {
    return this.arguments.some((arg: YCArgument) => arg.isCustom);
  }

  // Returns the amount of custom arguments required
  get customArgumentsLength(): number {
    return this.arguments.filter((arg: YCArgument) => arg.isCustom).length;
  }

  // =================
  //   SINGLETON REF
  // =================
  getInstance = (id: string): YCFunc | null => {
    // We try to find an existing instance of this user
    const existingUser = YCFunc.instances.get(id);

    // If we have an existing user and it has the same fields as this one, we return the singleton of it
    if (existingUser) {
      if (this.compare(existingUser)) return existingUser;
    }

    YCFunc.instances.set(id, this);

    return null;
  };

  static instances: Map<string, YCFunc> = new Map();

  /**
   * Custom toJSON function
   */
  toJSON = (retainArgs: boolean = false): DBFunction => {
    return {
      id: this.id,
      name: this.name,
      dependancy_function_id: this.dependencyFunction?.id || null,
      inverse_function_id: this.counterFunction?.id || null,
      arguments_ids: this.arguments.map((arg) =>
        retainArgs ? arg.toJSON(retainArgs) : arg.id
      ) as string[],
      callback: this.isCallback,
      typeflag: this.typeflag,
      ret_typeflag: this.retTypeflag,
      address_id: this.address?.id || "",
      actions_ids: this.actions.map((action) => action.id),
      outflows: this.outflows.map((token) => token.id),
      inflows: this.inflows.map((token) => token.id),
      signature: this.signature,
      copy_args: this.copyArgs,
    };
  };

  protected argumentsManipulated = false;
  setArguments(newArgs: YCArgument[]) {
    this.argumentsManipulated = true;
    this.#arguments = newArgs;
  }
}

export interface TokenPercentageImplementor {
  tokenPercentages: Map<string, TokenPercentage>;
}
