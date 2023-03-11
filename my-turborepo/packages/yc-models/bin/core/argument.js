/**
 * @notice
 * YCArgument
 * A class representing a Yieldchain "Argument" - Used in function calls.
 * @dev When arguments r considered dynamic, their type is a 'function' - which means we
 * encode a FunctionCall struct eventually and use the return value of it as the value.
 */
export default class YCArgument {
    // =======================
    //    PRIVATE VARIABLES
    // =======================
    #value;
    #solidityType;
    #isCustom;
    #isArray;
    #identifier;
    #index;
    #name;
    // =======================
    //      CONSTRUCTOR
    // =======================
    constructor(_argument, _context, _customArgument) {
        // Init private variables
        this.#solidityType = _argument.solidity_type;
        this.#isArray = _argument.solidity_type.includes("[");
        this.#identifier = _argument.parameter_identifier;
        this.#index = _argument.index;
        this.#name = _argument.name;
        this.#isCustom = _argument.value.includes("custom_argument");
        // Set Fields For The Custom Argument
        if (this.#isCustom) {
            // If we didnt get a custom argument, we throw an error
            if (!_customArgument)
                throw new Error("YCArgument ERR: Unable to set argument value - Argument is a custom field, but no custom argument was provided.");
            // @notice
            // Checking if we got an array of custom arguments, or just one.
            // If we got one we just iterate once,
            // Else we iterate over each item
            let iterations = [];
            Array.isArray(_customArgument)
                ? _customArgument.forEach((arg) => iterations.push(arg))
                : iterations.push(_customArgument);
            // Init value
            let value = [];
            for (let i = 0; i < iterations.length; i++) {
                // Current argument being iterated over
                let currentArgPart = iterations[i];
                // If it's not a function, just use the inputted value
                if (!currentArgPart.isFunction)
                    value[i] = currentArgPart.value;
                // If it is a function, set the value to the function using the value as an ID
                else {
                    let func = _context.getFunction(parseInt(currentArgPart.value));
                    if (!func)
                        throw new Error("YCArgument ERR: Unable to set argument value - Argument is a custom function, but was unable to retreive function by ID - funcID: " +
                            currentArgPart.value);
                    value[i] = func;
                }
            }
            // Either set the array or the plain value
            if (value.length > 1)
                this.#value = value;
            else
                this.#value = value[0];
            return this;
        }
        // If the argument type is not a function - we simply use the hardcoded value
        if (_argument.solidity_type !== "function") {
            this.#value = _argument.value;
            return this;
        }
        // @notice
        // If the solidity type is a function, the value is refering to the identifier of the function.
        // We want to use it when encoding this argument so that it can be evaluated at runtime
        // Get the YCFunc object
        let func = _context.getFunction(parseInt(_argument.value));
        // Throw an error if we got a null back
        if (!func) {
            throw new Error("Function In YCArgument not found! Function ID: " + _argument.value);
        }
        // Assign the value to the YCFunc instance
        this.#value = func;
    }
    // =============
    //    METHODS
    // =============
    type = () => {
        return this.#solidityType;
    };
    // Returns true if the argument is considered a "custom" argument
    isCustom = () => {
        return this.#isCustom;
    };
    // Encode the argument
    encode = () => {
        let encodedValue = "0x";
        if (Array.isArray(this.#value)) {
        }
        return "0x";
    };
}
// type ISolidityType = string | SolidityTypes
// const getSolidityType = (_stringSolidityType: string): string | SolidityTypes => {
//     return SolidityTypes[_stringSolidityType] ? SolidityTypes[_stringSolidityType] : _stringSolidityType
// }
// enum SolidityTypes {
//   int8 ,
//   int16,
//   int32,
//   int64,
//   int128,
//   int256,
//   uint8,
//   uint16,
//   uint32,
//   uint64,
//   uint128,
//   uint256,
//   bool,
//   address,
//   string,
//   struct,
//   bytes,
//   bytes1,
//   bytes2,
//   bytes3,
//   bytes4,
//   bytes5,
//   bytes6,
//   bytes7,
//   bytes8,
//   bytes9,
//   bytes10,
//   bytes11,
//   bytes12,
//   bytes13,
//   bytes14,
//   bytes15,
//   bytes16,
//   bytes17,
//   bytes18,
//   bytes19,
//   bytes20,
//   bytes21,
//   bytes22,
//   bytes23,
//   bytes24,
//   bytes25,
//   bytes26,
//   bytes27,
//   bytes28,
//   bytes29,
//   bytes30,
//   bytes31,
//   bytes32,
//   function,
// }
//# sourceMappingURL=argument.js.map