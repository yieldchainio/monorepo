import { DBFunction, JSONStep } from "../../types/db.js";
import { YCClassifications } from "../context/context.js";
import { YCContract } from "../address/address.js";
import { YCArgument } from "../argument/argument.js";
import { FunctionCallStruct, EncodingContext, TokenPercentage } from "../../types/index.js";
import { Typeflags } from "@prisma/client";
import { BaseClass } from "../base/index.js";
import { YCAction } from "../action/action.js";
import { YCToken } from "../token/token.js";
import { bytes } from "../../types/index.js";
export declare class YCFunc extends BaseClass {
    #private;
    static readonly FunctionCallTuple = "tuple(address target_address, bytes[] args, string signature)";
    readonly id: string;
    readonly name: string;
    readonly address: YCContract | null;
    readonly actions: YCAction[];
    readonly isCallback: boolean;
    readonly counterFunction: YCFunc | null;
    readonly dependencyFunction: YCFunc | null;
    readonly outflows: YCToken[];
    readonly inflows: YCToken[];
    readonly signature: string;
    readonly typeflag: Typeflags;
    readonly retTypeflag: Typeflags;
    get arguments(): YCArgument[];
    readonly copyArgs: boolean;
    constructor(_function: DBFunction, _context: YCClassifications);
    encodeYCCommand: (step: JSONStep, context: EncodingContext, customArguments: Array<any | YCFunc>) => bytes;
    /**
     * @method toFunctionCallStruct
     * @param customArguments - Custom arguments that should be provided if the function requires any.
     * @returns A @interface FunctionCallStruct that represents an on-chain FunctionCallStruct struct.
     */
    toFunctionCallStruct: (step: JSONStep, context: EncodingContext, customArguments: Array<string | null>) => FunctionCallStruct;
    get requiresCustom(): boolean;
    get customArgumentsLength(): number;
    getInstance: (id: string) => YCFunc | null;
    static instances: Map<string, YCFunc>;
    /**
     * Custom toJSON function
     */
    toJSON: (retainArgs?: boolean) => DBFunction;
    protected argumentsManipulated: boolean;
    setArguments(newArgs: YCArgument[]): void;
}
export interface TokenPercentageImplementor {
    tokenPercentages: Map<string, TokenPercentage>;
}
