import { YCClassifications } from "../context/context.js";
import { DBArgument, JSONStep } from "../../types/db.js";
import { bytes } from "../../types/global.js";
import { YCFunc } from "../function/function.js";
import { BaseClass } from "../base/index.js";
import { Typeflags } from "@prisma/client";
import { EncodingContext } from "../../types/index.js";
import { YCToken } from "..";
/**
 * @notice
 * YCArgument
 * A class representing a Yieldchain "Argument" - Used in function calls.
 * @dev When arguments r considered dynamic, their type is a 'function' - which means we
 * encode a FunctionCall struct eventually and use the return value of it as the value.
 */
export declare class YCArgument extends BaseClass {
    #private;
    instanceID: string;
    get value(): string | YCFunc | (string | YCFunc)[];
    readonly solidityType: string;
    readonly typeflag: Typeflags;
    readonly retTypeflag: Typeflags;
    get isCustom(): boolean;
    readonly devNotes: string | null;
    readonly identifier: string;
    readonly name: string | null;
    readonly id: string;
    relatingToken: YCToken | null;
    constructor(_argument: DBArgument, _context: YCClassifications);
    setValue: (newValue: any) => void;
    encodeYCCommand: (step: JSONStep, context: EncodingContext, customArgs: Array<string | null>) => bytes;
    toJSON(retainArgs?: boolean): DBArgument;
    static emptyArgument: (type?: string) => YCArgument;
}
