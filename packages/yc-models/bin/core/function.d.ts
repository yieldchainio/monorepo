import { DBFunction } from "../types/db";
import { YCClassifications } from "./classification";
import YCAddress from "./address";
import YCArgument from "./argument";
import YCFlow from "./flow";
import YCStep from "./step";
import { FunctionCall, CallTypes } from "../types/yc";
export default class YCFunc {
    #private;
    static readonly FunctionCallTuple = "(address,bytes[],string,bool)";
    constructor(_function: DBFunction, _context: YCClassifications);
    name: () => string;
    ID: () => number;
    address: () => YCAddress | null;
    counterFunction: () => YCFunc | null;
    unlockedBy: () => YCFunc | null;
    callType: () => CallTypes;
    signature: () => string;
    flows: () => YCFlow[];
    arguments: () => YCArgument[];
    isCallback: () => boolean;
    encode: (_step?: YCStep) => string;
    FunctionCallStruct: (_step?: YCStep) => FunctionCall;
    requiresCustom: () => boolean;
    returnFlag: () => string;
}
