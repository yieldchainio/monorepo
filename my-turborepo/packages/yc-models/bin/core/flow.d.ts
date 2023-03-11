import { DBToken, DBFlow } from "../types/db";
import { YCClassifications } from "./classification";
/**
 * @notice
 * YCFlow
 * Constructs a class representing a "Flow" - i.e a token/funds movement.
 *
 */
export default class YCFlow {
    #private;
    constructor(_flow: DBFlow, _context: YCClassifications);
    direction: () => FlowDirections;
    token: () => DBToken;
}
declare enum FlowDirections {
    outflow = 0,
    inflow = 1
}
export {};
