import { YCArgument, YCFunc } from "../../core/index.js";
import { typeflags } from "../../types/index.js";
import { TypeflagValues } from "../../constants.js";

/**
 * Add YC Command encoding typeflags, based on argument instance
 * @param argument - YCArgument instance
 * @return typeflags - The typeflags to prepend
 */
export const getArgumentFlags = (arg: YCArgument): typeflags => {
  // Return the mapped flags
  return (TypeflagValues[arg.typeflag] +
    TypeflagValues[arg.retTypeflag]) as typeflags;
};

export const getFunctionFlags = (func: YCFunc): typeflags => {
  // Return the mapped flags
  return (TypeflagValues[func.typeflag] +
    TypeflagValues[func.retTypeflag]) as typeflags;
};
