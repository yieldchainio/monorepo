import { DBToken } from "../types/db";
import { YCClassifications } from "./classification";
import YCProtocol from "./protocol";
import YCNetwork from "./network";
/**
 * @notice
 * YCToken
 * A class representing an on-chain token
 */
export default class YCToken {
    #private;
    constructor(_token: DBToken, _context: YCClassifications);
    address: () => string;
    decimals: () => number;
    parseDecimals: (_number: string | number | bigint) => bigint;
    network: () => YCNetwork | null;
    markets: () => YCProtocol[];
    price: () => Promise<number | null>;
    priceAgainstToken: (_token: YCToken) => Promise<number | null>;
    isNative: () => boolean;
    isInMarket: (_protocolID: number) => boolean;
}
