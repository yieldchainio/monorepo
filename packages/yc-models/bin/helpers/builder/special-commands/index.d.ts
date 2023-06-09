import { YCArgument } from "../../../core/index.js";
import { EncodingContext, JSONStep } from "../../../types/index.js";
/**
 * @notice
 * Helper function to parse, based on a switch-case, some utility commands
 * @param step - Instance of a step that implements some variables we need
 * @param context - Encoding context (SEED, TREE, UPROOT)
 * @param argument - The argument to aprse for utility methods
 * @param customValues - Array of custom values provided to the argument
 * @return encodedCommand - Either an encoded command if found utility to parse, or null if none
 */
export declare const trySpecialEncoding: (step: JSONStep, context: EncodingContext, argument: YCArgument, customArgs: Array<string | null>) => string | null;
