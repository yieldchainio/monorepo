import { YCClassifications } from "./classification";
import { DBArgument } from "../types/db";
import { bytes } from "../types/global";
export interface CustomArgument {
    value: any;
    isFunction: boolean;
}
/**
 * @notice
 * YCArgument
 * A class representing a Yieldchain "Argument" - Used in function calls.
 * @dev When arguments r considered dynamic, their type is a 'function' - which means we
 * encode a FunctionCall struct eventually and use the return value of it as the value.
 */
export default class YCArgument {
    #private;
    constructor(_argument: DBArgument, _context: YCClassifications, _customArgument?: CustomArgument | CustomArgument[]);
    type: () => string;
    isCustom: () => boolean;
    encode: () => bytes;
}
