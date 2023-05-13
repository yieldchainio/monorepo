import { YCArgument } from "../../../../core/index.js";
import { EncodingContext, JSONStep } from "../../../../types/index.js";
/**
 * Encode a getInvestmentAmount() YC Command
 */
export declare const encodeGetInvestmentAmount: (step: JSONStep, context: EncodingContext, argument: YCArgument) => string;
/**
 * Create a YC Func which is used to retreive the withdraw shares from memory
 */
