import { DBProtocol } from "../../types/db.js";
import { YCClassifications } from "../context/context.js";
import { YCSocialMedia } from "../social-media/social-media.js";
import { BaseClass } from "../base/index.js";
import { ProtocolType } from "@prisma/client";
import { YCNetwork } from "../network/network.js";
import { YCToken } from "../token/token.js";
import { YCContract } from "../address/address.js";
/**
 * @notice
 * YCProtocol
 * A class representing a Yieldchain protocol
 */
export declare class YCProtocol extends BaseClass {
    #private;
    /**
     * The ID of this protocol (uuid)
     */
    readonly id: string;
    /**
     * The name of this protocol (Pancakeswap, Uniswap, GMX, etc)
     */
    readonly name: string;
    /**
     * The types of this protocol (EXCHANGE, LIQUIDITY, STAKING, INTEGRATION, etc)
     */
    readonly types: ProtocolType[];
    /**
     * Whether this protocol is available for use or not
     */
    readonly available: boolean;
    /**
     * All of the contracts available under this protocol (that are classified)
     */
    readonly contracts: YCContract[];
    /**
     * The website URL of this protocol (https://uniswap.org)
     */
    readonly website: string;
    /**
     * The logo URI of this protocol
     */
    readonly logo: string;
    /**
     * Social media instance of all of this protocol's social medias
     */
    readonly socialMedia: YCSocialMedia;
    /**
     * Color of this protocol (can be null, frontend)
     */
    readonly color: string | null;
    get tokens(): YCToken[];
    /**
     * The networks this protocol is available on
     */
    readonly networks: YCNetwork[];
    constructor(_protocol: DBProtocol, _context: YCClassifications);
    getInstance: (id: string) => YCProtocol | null;
    static instances: Map<string, YCProtocol>;
    toJSON: () => DBProtocol;
}
