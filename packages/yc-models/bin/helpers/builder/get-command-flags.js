import { TypeflagValues } from "../../constants.js";
/**
 * Add YC Command encoding typeflags, based on argument instance
 * @param argument - YCArgument instance
 * @return typeflags - The typeflags to prepend
 */
export const getArgumentFlags = (arg) => {
    // Return the mapped flags
    return (TypeflagValues[arg.typeflag] +
        TypeflagValues[arg.retTypeflag]);
};
export const getFunctionFlags = (func) => {
    // Return the mapped flags
    return (TypeflagValues[func.typeflag] +
        TypeflagValues[func.retTypeflag]);
};
//# sourceMappingURL=get-command-flags.js.map