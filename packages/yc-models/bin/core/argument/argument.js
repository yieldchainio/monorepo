import { YCFunc } from "../function/function.js";
import { BaseClass } from "../base/index.js";
import { getArgumentFlags } from "../../helpers/builder/get-command-flags.js";
import { AbiCoder } from "ethers";
import { trySpecialEncoding } from "../../helpers/builder/special-commands/index.js";
import { v4 as uuid } from "uuid";
import { remove0xPrefix } from "../../helpers/builder/remove-0x-prefix.js";
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
    instanceID;
    #value;
    get value() {
        return this.#value;
    }
    solidityType;
    typeflag;
    retTypeflag;
    #isCustom;
    get isCustom() {
        return this.#isCustom;
    }
    devNotes = null;
    identifier;
    name;
    id;
    relatingToken;
    #overridenCustomArguments = [];
    // =======================
    //      CONSTRUCTOR
    // =======================
    constructor(_argument, _context) {
        super();
        this.instanceID = uuid();
        // Init variables
        this.solidityType = _argument.solidity_type;
        this.typeflag = _argument.typeflag;
        this.retTypeflag = _argument.ret_typeflag;
        this.identifier = _argument.id;
        this.name = _argument.name;
        this.#isCustom = _argument.custom;
        this.id = _argument.id;
        this.devNotes = _argument.dev_notes || null;
        this.relatingToken = _argument.relating_token
            ? _context.getToken(_argument.relating_token)
            : null;
        // @notice
        // If the solidity type is a function, the value is refering to the identifier of the function.
        // We want to use it when encoding this argument so that it can be evaluated at runtime
        // Get the YCFunc object
        if (_argument.solidity_type == "function") {
            const func = typeof _argument.value == "string"
                ? _context.rawFunctions.find((func) => func.id == _argument.value)
                : _argument.value;
            // Throw an error if we got a null back
            if (!func) {
                throw new Error("Function In YCArgument not found! Function ID: " + _argument.value);
            }
            // Assign the value to the YCFunc instance
            this.#value = new YCFunc(func, _context, true);
            // Replace the value (func)'s custom arguments with our overrides if any
            this.#overridenCustomArguments = _argument.overridden_custom_values;
            for (let i = 0; i < _argument.overridden_custom_values.length; i++) {
                const potentialUnderlyingArgID = _argument.overridden_custom_values[i];
                if (potentialUnderlyingArgID == "undefined")
                    continue;
                const underlyingJsonArg = _context.rawArguments.find((arg) => arg.id == potentialUnderlyingArgID);
                if (!underlyingJsonArg)
                    throw ("Cannot Get Underlying Arg Of Override. ID: " +
                        potentialUnderlyingArgID);
                const argInstance = new YCArgument(underlyingJsonArg, _context);
                if (!argInstance)
                    throw "Cannot Override Custom Args - Did Not Get Arg Instance";
                if (this.#value.arguments[i].isCustom)
                    this.#value.arguments[i] = argInstance;
            }
            // If the argument type is not a function - we simply use the hardcoded value
        }
        else {
            try {
                const parsed = JSON.parse(_argument.value);
                if (Array.isArray(parsed))
                    this.#value = parsed;
                else
                    this.#value = _argument.value;
            }
            catch {
                this.#value = _argument.value;
            }
        }
    }
    // =============
    //    METHODS
    // =============
    // Set the value of the argument, used by unique utility parsers
    setValue = (newValue) => {
        console.log("Setting New Value. Current Value:", this.#value, "Is Custom:", this.#isCustom, "New Value:", newValue);
        if (!this.#isCustom)
            throw "Cannot Set Value To Non-Custom Argument";
        this.#value = newValue;
        this.#isCustom = false;
    };
    // Encode the argument
    encodeYCCommand = (step, context, customValue) => {
        // @notice We first attempt to get some special utility encoding through. If we do, we return that instead.
        // Otherwise, we continue on to the reguler encoding
        const specialCommand = trySpecialEncoding(step, context, this);
        if (specialCommand)
            return specialCommand;
        // Begin by getting the typeflags to prepend
        const typeflags = getArgumentFlags(this);
        // Init variable for the naked encoded command
        let command = typeflags;
        // Encode either our value, or provided custom value if we are custom
        if (this.isCustom) {
            if (customValue == undefined)
                throw ("Cannot Encode Argument As YC Command - Expected Custom Value, But Got None. ID: " +
                    this.id);
            if (this.solidityType == "address")
                console.log("About To Encode Address Custom Value... Custom Value:", customValue, "This Arg ID:", this.id, "Value:", this.value);
            command += remove0xPrefix(AbiCoder.defaultAbiCoder().encode([this.solidityType], [customValue]));
        }
        // If we are a function, encode it instead
        else if (this.value instanceof YCFunc)
            command = remove0xPrefix(this.value.encodeYCCommand(step, context, step.customArguments));
        // Else, encode our value normally
        else
            command += remove0xPrefix(AbiCoder.defaultAbiCoder().encode([this.solidityType], [this.value]));
        if (command.length < 6)
            throw "Cannot Encode Arg - Naked Command Length Is 0";
        return "0x" + command;
    };
    toJSON(retainArgs = false) {
        return {
            id: this.id,
            name: this.name,
            solidity_type: this.solidityType,
            value: (this.value instanceof YCFunc
                ? retainArgs
                    ? this.value.toJSON(retainArgs)
                    : this.value.id
                : this.value),
            custom: this.isCustom,
            typeflag: this.typeflag,
            ret_typeflag: this.retTypeflag,
            relating_token: this.relatingToken?.id || null,
            overridden_custom_values: this.#overridenCustomArguments,
            dev_notes: this.devNotes,
        };
    }
}
//# sourceMappingURL=argument.js.map