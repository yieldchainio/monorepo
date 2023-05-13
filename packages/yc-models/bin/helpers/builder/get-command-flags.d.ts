import { YCArgument, YCFunc } from "../../core/index.js";
import { typeflags } from "../../types/index.js";
/**
 * Add YC Command encoding typeflags, based on argument instance
 * @param argument - YCArgument instance
 * @return typeflags - The typeflags to prepend
 */
export declare const getArgumentFlags: (arg: YCArgument) => typeflags;
export declare const getFunctionFlags: (func: YCFunc) => typeflags;
