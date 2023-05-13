import { ExtendedArgument, DBFunction } from "../../offchain-types.js";
/**
 * Get the full arguments details of a function
 * @param fullFunc
 * @returns
 */
export declare const getFunctionParams: (fullFunc: DBFunction) => Promise<ExtendedArgument[]>;
