/**
 * A class representing a fullfill request
 * @param fullfillRequestEvent - An onchain RequestFulfill event
 */
import { YcCommand } from "@yc/yc-models";
import { RequestFullfillEvent } from "../../../types.js";
import { JsonRpcProvider } from "ethers";
export declare class FulfillRequest {
    #private;
    constructor(fulfillRequestEvent: RequestFullfillEvent, fork: JsonRpcProvider);
    fulfill(): Promise<YcCommand | null>;
    get stepIndex(): number | null;
}
