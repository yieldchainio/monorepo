import { YCClassifications } from "../context/context";
import { DBArgument } from "../../types/db";
import { bytes } from "../../types/global";
import { TokenPercentageImplementor, YCFunc } from "../function/function";
import { BaseClass } from "../base";
import { Typeflags } from "@prisma/client";
import { CustomArgsTree, EncodingContext, typeflags } from "../../types";
import { getArgumentFlags } from "../../helpers/builder/get-command-flags";
import { AbiCoder } from "ethers";
import { YCToken } from "..";
import { trySpecialEncoding } from "../../helpers/builder/special-commands";

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
    this.isCustom = _argument.custom;
    this.id = _argument.id;
    this.relatingToken = _argument.relating_token
      ? _context.getToken(_argument.relating_token)
      : null;

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

      // Replace the value (func)'s custom arguments with our overrides if any
      for (let i = 0; i < _argument.overridden_custom_values.length; i++) {
        const customVal = _argument.overridden_custom_values[i];
        if (customVal == null) continue;
        const argInstance = _context.getArgument(customVal);
        if (!argInstance)
          throw "Cannot Override Custom Args - Did Not Get Arg Instance";
        if (customVal !== null) func.arguments[i] = argInstance;
      }

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
    customValue?: CustomArgsTree
  ): bytes => {
    // @notice We first attempt to get some special utility encoding through. If we do, we return that instead.
    // Otherwise, we continue on to the reguler encoding
    const specialCommand: bytes | null = trySpecialEncoding(
      step,
      context,
      this,
      customValue as CustomArgsTree
    );
    if (specialCommand) return specialCommand;

    // Begin by getting the typeflags to prepend
    const typeflags: typeflags = getArgumentFlags(this);

    // Init variable for the naked encoded command
    let command: bytes = typeflags;

    // Then, check to see if our argument is a custom value.
    // If it is, then we check to see if it's an instance of YC func.
    // If it is, we call encode YC command on it. Otherwise, we just abi.encode it
    if (this.isCustom) {
      if (!customValue) throw "Cannot Encode - Current Custom Value Undefined";

      // If function, call encodeYCCommand on it, include remaining custom values
      if (customValue.value instanceof YCFunc)
        command = customValue.value.encodeYCCommand(
          step,
          context,
          customValue.customArgs
        );
      // Else, just ABI encode it and add to existing typeflags
      else
        command += AbiCoder.defaultAbiCoder().encode(
          [this.solidityType],
          [customValue.value]
        );
    }

    // Assert that naked command length is bigger than 0 (excluding typeflags)
    if (command.length < 6)
      throw "Cannot Encode Arg - Naked Command Length Is 0";

    // Return the typeflags + naked command
    return command;
  };
}

