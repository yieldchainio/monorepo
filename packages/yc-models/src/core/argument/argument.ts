import { YCClassifications } from "../context/context";
import { DBArgument } from "../../types/db";
import { bytes } from "../../types/global";
import { TokenPercentageImplementor, YCFunc } from "../function/function";
import { BaseClass } from "../base";
import { Typeflags } from "@prisma/client";
import { EncodingContext, typeflags } from "../../types";
import { getArgumentFlags } from "../../utils/builder/get-command-flags";
import { AbiCoder } from "ethers";
import { YCToken } from "..";
import { encodeUniqueCommands } from "../../utils/builder/special-commands";

/**
 * @notice
 * YCArgument
 * A class representing a Yieldchain "Argument" - Used in function calls.
 * @dev When arguments r considered dynamic, their type is a 'function' - which means we
 * encode a FunctionCall struct eventually and use the return value of it as the value.
 */
export class YCArgument extends BaseClass {
  // =======================
  //    PRIVATE VARIABLES
  // =======================
  #value: string | YCFunc | Array<string | YCFunc>;
  get value() {
    return this.#value;
  }
  readonly solidityType: string;
  readonly typeflag: Typeflags;
  readonly retTypeflag: Typeflags;
  readonly isCustom: boolean;
  readonly identifier: string;
  readonly name: string | null;
  readonly id: string;
  readonly relatingToken: YCToken | null;
  readonly preconfiguredCustomValues: Array<YCArgument | null>;

  // =======================
  //      CONSTRUCTOR
  // =======================
  constructor(_argument: DBArgument, _context: YCClassifications) {
    super();
    // Init variables
    this.solidityType = _argument.solidity_type;
    this.typeflag = _argument.typeflag;
    this.retTypeflag = _argument.ret_typeflag;
    this.identifier = _argument.id;
    this.name = _argument.name;
    this.isCustom = _argument.value.includes("custom_argument");
    this.id = _argument.id;
    this.relatingToken = _argument.relating_token
      ? _context.getToken(_argument.relating_token)
      : null;

    this.preconfiguredCustomValues =
      _argument.preconfigured_custom_values.flatMap((argID: string | null) => {
        if (!argID) return [null];
        const arg = _context.getArgument(argID);
        return arg ? [arg] : [];
      });

    // @notice
    // If the solidity type is a function, the value is refering to the identifier of the function.
    // We want to use it when encoding this argument so that it can be evaluated at runtime
    // Get the YCFunc object
    if (_argument.solidity_type == "function") {
      let func = _context.getFunction(_argument.value);

      // Throw an error if we got a null back
      if (!func) {
        throw new Error(
          "Function In YCArgument not found! Function ID: " + _argument.value
        );
      }

      // Assign the value to the YCFunc instance
      this.#value = func;

      // If the argument type is not a function - we simply use the hardcoded value
    } else this.#value = _argument.value;
  }

  // =============
  //    METHODS
  // =============
  // Set the value of the argument, used by unique utility parsers
  setValue = (newValue: any) => {
    if (!this.isCustom) throw "Cannot Set Value To Non-Custom Argument";
    this.#value = newValue;
  };

  // Encode the argument
  encodeYCCommand = (
    step: TokenPercentageImplementor,
    context: EncodingContext,
    customValues: Array<any | YCFunc>
  ): bytes => {
    // Assert that if we are a custom argument, a custom value mut be provided
    if (this.isCustom && !customValues.length)
      throw "YCArgument ERR: This Argument Is A Custom, but no custom value was provided.";

    // We insert into the custom values, our preconfigured custom values at their indexes, if any
    

    // @notice We first attempt to get some special utility encoding through. If we do, we return that instead.
    // Otherwise, we continue on to the reguler encoding
    const specialCommand: string | null = encodeUniqueCommands(
      step,
      context,
      this,
      customValues
    );
    if (specialCommand) return specialCommand;

    // Begin by getting the typeflags to prepend
    const typeflags: typeflags = getArgumentFlags(this);

    // Init variable for the naked encoded command
    let command: string = typeflags;

    // Then, check to see if our argument is a custom value.
    // If it is, then we check to see if it's an instance of YC func.
    // If it is, we call encode YC command on it. Otherwise, we just abi.encode it
    if (this.isCustom) {
      // @notice We get the current custom argument by shifting it out of the array. This allows us
      // To include recursive custom arguments, where our custom arguments may be functions that also require
      // custom arguments.
      const currentCustomValue = customValues.shift();

      // If function, call encodeYCCommand on it, include remaining custom values
      if (currentCustomValue instanceof YCFunc)
        command = currentCustomValue.encodeYCCommand(
          step,
          context,
          customValues
        );
      // Else, just ABI encode it and add to existing typeflags
      else
        command += AbiCoder.defaultAbiCoder().encode(
          [this.solidityType],
          [currentCustomValue]
        );
    }

    // Assert that naked command length is bigger than 0 (excluding typeflags)
    if (command.length < 6)
      throw "Cannot Encode Arg - Naked Command Length Is 0";

    // Return the typeflags + naked command
    return command;
  };
}

export interface TokenPercentages {}
