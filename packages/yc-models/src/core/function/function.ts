import { DBFunction } from "../../types/db";
import { YCClassifications } from "../context/context";
import { YCAddress } from "../address/address";
import { YCArgument } from "../argument/argument";
import { YCFlow } from "../flow/flow";
import { YCStep } from "../step/step";
import { FunctionCall, CallTypes } from "../../types/yc";
import { CallType, VariableTypes, BaseVariableTypes } from "@prisma/client";
import { BaseClass } from "../base";

const addFlags = (arg: any, _arg: any, arg_: any, arg__: any, _arg_: any) => {
  return arg;
};

export class YCFunc extends BaseClass {
  // ====================
  //    STATIC FIELDS
  // ====================

  // The signature used to encode/decode the FunctionCall struct - i.e a tuple representing it's fields
  static readonly FunctionCallTuple = "(address,bytes[],string,bool)";

  // ====================
  //    PRIVATE FIELDS
  // ====================
  readonly id: string;
  readonly name: string;
  readonly address: YCAddress | null;
  readonly isCallback: boolean;
  readonly counterFunction: YCFunc | null;
  readonly dependencyFunction: YCFunc | null;
  readonly flows: YCFlow[];
  readonly signature: string;
  readonly calltype: CallType;
  readonly arguments: YCArgument[];
  readonly returnType: string;
  readonly returnBaseType: BaseVariableTypes;

  // ====================
  //     CONSTRUCTOR
  // ====================
  constructor(_function: DBFunction, _context: YCClassifications) {
    super();
    // Static variables
    this.id = _function.id;
    this.name = _function.name;
    this.returnType = _function.return_value_type;
    this.returnBaseType = _function.return_value_base_type;
    this.isCallback = _function.callback;

    this.calltype = _function.call_type;

    // Mapping arg identifiers => Full argument instances
    let fullArgs = _function.arguments_ids.map((_arg: string) =>
      _context.getArgument(_arg)
    );

    // Throw an error and assign no arguments if the arguments include a null value
    if (fullArgs.includes(null)) {
      this.arguments = [];
      throw new Error(
        "YCFunc ERROR: Found Null Argument. Argument Value: " +
          fullArgs.find((arg: YCArgument | null) => arg == null)
      );
    } else {
      // Should be sufficient anyway - Typescript whining for no reason.
      this.arguments = fullArgs.flatMap((arg: YCArgument | null) =>
        arg !== null ? [arg] : []
      );
    }

    // Create signature
    let tempSig: string = `${this.name}(`;
    for (let i = 0; i < this.arguments.length; i++) {
      tempSig += this.arguments[i].type();
      if (i != this.arguments.length - 1) tempSig += ",";
    }
    tempSig += ")";
    this.signature = tempSig;

    // Mapping flow identifiers => Full Flows intances
    this.flows = _function.flows_ids.flatMap((_flow: string) => {
      let flow = _context.getFlow(_flow);
      if (flow) return [flow];
      return [];
    });

    /**
     * We set it as the string ID first before attemtping to get an existing singleton instance.
     * This is done in order for the comparison function to see our fields correctly, since it would have
     * converted the instances into IDs anyway.
     */
    this.counterFunction = _function.inverse_function_id as unknown as YCFunc;
    this.dependencyFunction =
      _function.dependancy_function_id as unknown as YCFunc;
    this.address = _function.address_id as unknown as YCAddress;

    // Get the existing instance (or set ours otherwise)
    const existingFunc = this.getInstance(_function.id);
    if (existingFunc) return existingFunc;

    // Set the actual dependency/counter functions
    this.counterFunction = _function.inverse_function_id
      ? _context.getFunction(_function.inverse_function_id)
      : null;
    this.dependencyFunction = _function.dependancy_function_id
      ? _context.getFunction(_function.dependancy_function_id)
      : null;

    let address: YCAddress | undefined = _context.addresses.find(
      (address: YCAddress) => address.hasFunction(this.id)
    );

    if (!address)
      throw new Error("YCFunc ERR: Address Not Found! Func ID: " + this.id);

    this.address = address;
  }

  // =========================
  //    GENERATION METHODS
  // =========================

  // Encode the current function as a FunctionCall struct, add flag
  encode = (_step?: YCStep): string => {
    if (!this.address)
      throw new Error(
        "YCFunc ERR: Cannot Encode - Address Not Found. Function ID: " + this.id
      );

    // Ethers interface for encoding
    let iface = this.address.interface;

    // FunctionCall struct that will be ncoded
    let functionCall: FunctionCall = this.FunctionCallStruct(_step);

    // Encode the function call
    let encodedFunction = iface
      .getAbiCoder()
      .encode([YCFunc.FunctionCallTuple], [functionCall]);

    // get the flag'ified encoded FunctionCall
    let encodedWithFlags = addFlags(
      encodedFunction,
      "function",
      this.calltype,
      this.returnType,
      this.returnBaseType
    );

    // Return the encoded function with the flag
    return encodedWithFlags;
  };

  // Return a FunctionCall struct
  FunctionCallStruct = (_step?: YCStep): FunctionCall => {
    // If the function requires custom arguments, then we must receive a step instance
    if (this.requiresCustom() && !_step) {
      throw new Error(
        "YCFunc ERR: Cannot Create FunctionCall - Function requires custom argument(s), but no step was provided"
      );
    }
    if (!this.address)
      throw new Error(
        "YCFuncERR: Cannot Create FunctionCall - Function Does Not Have An Address."
      );
    let struct: FunctionCall = {
      target_address: this.address.address,
      args: this.arguments.map((arg: YCArgument) => arg.encode()),
      signature: this.signature,
      is_callback: this.isCallback,
    };
    return struct;
  };

  // Returns true if the function requires a custom argument
  requiresCustom = (): boolean => {
    return this.arguments.some((arg: YCArgument) => arg.isCustom());
  };

  returnFlag = () => {
    return this.returnType;
  };

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

    return existingUser || null;
  };

  static instances: Map<string, YCFunc> = new Map();
}
