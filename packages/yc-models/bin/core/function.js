const addFlags = (arg, _arg, arg_, arg__, _arg_) => {
    return arg;
};
export default class YCFunc {
    // ====================
    //    STATIC FIELDS
    // ====================
    // The signature used to encode/decode the FunctionCall struct - i.e a tuple representing it's fields
    static FunctionCallTuple = "(address,bytes[],string,bool)";
    // ====================
    //    PRIVATE FIELDS
    // ====================
    #identifier;
    #name;
    #address;
    #argumentsAmt;
    #isCallback;
    #counterFunction;
    #unlockedByFunction;
    #flows;
    #signature;
    #calltype;
    #arguments;
    #returnType;
    #returnBaseType;
    // ====================
    //     CONSTRUCTOR
    // ====================
    constructor(_function, _context) {
        // Static variables
        this.#identifier = _function.function_identifier;
        this.#name = _function.function_name;
        this.#argumentsAmt = _function.arguments.length;
        this.#returnType = _function.return_type;
        this.#returnBaseType = _function.return_base_type;
        this.#counterFunction = _function.counter_function_identifier
            ? _context.getFunction(_function.counter_function_identifier)
            : null;
        this.#isCallback = _function.is_callback;
        this.#unlockedByFunction = _function.unlocked_by
            ? _context.getFunction(_function.unlocked_by)
            : null;
        this.#calltype = _function.callType;
        let address = _context
            .addresses()
            .find((address) => address.hasFunction(this.ID()));
        if (!address)
            throw new Error("YCFunc ERR: Address Not Found! Func ID: " + this.ID());
        this.#address = address;
        // Mapping arg identifiers => Full argument instances
        let fullArgs = _function.arguments.map((_arg) => _context.getArgument(_arg));
        // Throw an error and assign no arguments if the arguments include a null value
        if (fullArgs.includes(null)) {
            this.#arguments = [];
            throw new Error("YCFunc ERROR: Found Null Argument. Argument Value: " +
                fullArgs.find((arg) => arg == null));
        }
        else {
            // Should be sufficient anyway - Typescript whining for no reason.
            this.#arguments = fullArgs.flatMap((arg) => arg !== null ? [arg] : []);
        }
        // Create signature
        let tempSig = `${this.#name}(`;
        for (let i = 0; i < this.#arguments.length; i++) {
            tempSig += this.#arguments[i].type();
            if (i != this.#arguments.length - 1)
                tempSig += ",";
        }
        tempSig += ")";
        this.#signature = tempSig;
        // Mapping flow identifiers => Full Flows intances
        this.#flows = _function.flows.flatMap((_flow) => {
            let flow = _context.getFlow(_flow);
            if (flow)
                return [flow];
            return [];
        });
    }
    // ==================
    //      METHODS
    // ==================
    // Name of the function
    name = () => {
        return this.#name;
    };
    // ID of the function
    ID = () => {
        return this.#identifier;
    };
    // Parent address
    address = () => {
        return this.#address;
    };
    // Counter function (i.e the function that does the opposite operations from this one)
    counterFunction = () => {
        return this.#counterFunction;
    };
    // The function that this function is unlocked by (e.g, harvestETH may be unlocked by stakeETH)
    unlockedBy = () => {
        return this.#unlockedByFunction;
    };
    // The call type (CALL, STATICCALL, DELEGATECALL)
    callType = () => {
        return this.#calltype;
    };
    // The signature (e.g "stakeETH(uint256,address)")
    signature = () => {
        return this.#signature;
    };
    // The YCFlow instances of the flows of this function
    flows = () => {
        return this.#flows;
    };
    // The YCArgument instances of the arguments of this function (i.e parameters)
    arguments = () => {
        return this.#arguments;
    };
    // A boolean indiciating whether this function requires an offchain callback request & fullfill
    isCallback = () => {
        return this.#isCallback;
    };
    // =========================
    //    GENERATION METHODS
    // =========================
    // Encode the current function as a FunctionCall struct, add flag
    encode = (_step) => {
        if (!this.#address)
            throw new Error("YCFunc ERR: Cannot Encode - Address Not Found. Function ID: " +
                this.ID());
        // Ethers interface for encoding
        let iface = this.#address.interface();
        // FunctionCall struct that will be ncoded
        let functionCall = this.FunctionCallStruct(_step);
        // Encode the function call
        let encodedFunction = iface
            .getAbiCoder()
            .encode([YCFunc.FunctionCallTuple], [functionCall]);
        // get the flag'ified encoded FunctionCall
        let encodedWithFlags = addFlags(encodedFunction, "function", this.#calltype, this.#returnType, this.#returnBaseType);
        // Return the encoded function with the flag
        return encodedWithFlags;
    };
    // Return a FunctionCall struct
    FunctionCallStruct = (_step) => {
        // If the function requires custom arguments, then we must receive a step instance
        if (this.requiresCustom() && !_step) {
            throw new Error("YCFunc ERR: Cannot Create FunctionCall - Function requires custom argument(s), but no step was provided");
        }
        if (!this.#address)
            throw new Error("YCFuncERR: Cannot Create FunctionCall - Function Does Not Have An Address.");
        let struct = {
            target_address: this.#address.address(),
            args: this.#arguments.map((arg) => arg.encode()),
            signature: this.#signature,
            is_callback: this.#isCallback,
        };
        return struct;
    };
    // Returns true if the function requires a custom argument
    requiresCustom = () => {
        return this.#arguments.some((arg) => arg.isCustom());
    };
    returnFlag = () => {
        return this.#returnType;
    };
}
//# sourceMappingURL=function.js.map