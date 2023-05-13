import { DBAction } from "../../types/db.js";
import { YCClassifications } from "../context/context.js";
import { YCFunc } from "../function/function.js";
export declare class YCAction {
    /**
     * Name of the action (e.g Stake, Add Liquidity, Harvest, Swap, Long)
     */
    readonly name: string;
    /**
     * Id of the action (uuid)
     */
    readonly id: string;
    /**
     * Popularity (index in popularity, e.g 0 === highest popularity)
     */
    readonly popularity: number;
    /**
     * Whether it is available or not (some are not yet fully integrated)
     */
    readonly available: boolean;
    /**
     * All of the functions that relate to this action (e.g a function called "depositTokens()" may be related to the stake function, depending on it's classification)
     */
    readonly functions: YCFunc[];
    /**
     * Icon of the action,
     * optional, used & assigned by the frontend.
     */
    icon: string | {
        dark: string;
        light: string;
    } | null;
    constructor(_action: DBAction, _context: YCClassifications);
}
