import { DBFlow } from "../../types/db.js";
import { YCClassifications } from "../context/context.js";
import { FlowDirection } from "@yc/yc-models";
import { YCToken } from "../token/token.js";
/**
 * @notice
 * YCFlow
 * Constructs a class representing a "Flow" - i.e a token/funds movement.
 *
 */
export declare class YCFlow {
    readonly id: string;
    readonly token: YCToken;
    readonly direction: FlowDirection;
    readonly native: boolean;
    constructor(_flow: DBFlow, _context: YCClassifications);
    toJSON: () => DBFlow;
}
