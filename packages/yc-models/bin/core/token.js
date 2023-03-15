import { ethers } from "ethers";
import LiFi from "../clients/lifi";
/**
 * @notice
 * YCToken
 * A class representing an on-chain token
 */
export default class YCToken {
    // =======================
    //    PRIVATE VARIABLES
    // =======================
    #name; // Init in constructor
    #symbol;
    #address;
    #logoURI = null; // Init to null (Optional field)
    #decimals;
    #markets = [];
    #native = false; // Init to false
    #type;
    #network;
    // =======================
    //      CONSTRUCTOR
    // =======================
    constructor(_token, _context) {
        // Init static fields
        this.#name = _token.name;
        this.#symbol = _token.symbol;
        this.#network = _context.getNetwork(_token.chain_id);
        this.#address = ethers.getAddress(_token.address);
        this.#decimals = _token.decimals;
        this.#logoURI = _token.logo;
        this.#type =
            this.#address == ethers.ZeroAddress ? TokenType.NATIVE : TokenType.ERC20; // TODO: Add Support for more token types? Requires throughout integration i believe (NFTs (ERC721), etc)
        this.#native = this.#address == ethers.ZeroAddress ? true : false;
        // Getting the token's available "markets" (i.e protocols where the token is liquid)
        let markets = _token.markets.map((protocolID) => _context.getProtocol(protocolID));
        for (const marketOrNull of markets) {
            if (marketOrNull)
                this.#markets.push(marketOrNull);
        }
        //
    }
    // =======================
    //        METHODS
    // =======================
    // The checksummed address
    address = () => {
        return ethers.getAddress(this.#address);
    };
    // Decimals
    decimals = () => {
        return this.#decimals;
    };
    // Parse a formatted number by the decimals
    parseDecimals = (_number) => {
        _number = BigInt(_number);
        return _number * 10n ** BigInt(this.decimals());
    };
    // The network instance it is on
    network = () => {
        return this.#network;
    };
    // All markets
    markets = () => {
        return this.#markets;
    };
    // Quote against $ USD
    price = async () => {
        return await new LiFi().getUSDPrice(this);
    };
    // Price against another token
    priceAgainstToken = async (_token) => {
        return await new LiFi().getTokenPrice(this, _token);
    };
    // Indiciating whether th
    isNative = () => {
        return this.#native;
    };
    // Check whether this token is liquid in a certain market (By ID)
    isInMarket = (_protocolID) => {
        return this.#markets.some((market) => market.ID());
    };
}
// Different type of tokens - Native token (e.g ETH), ERC20, ERC721, etc
var TokenType;
(function (TokenType) {
    TokenType[TokenType["NATIVE"] = 0] = "NATIVE";
    TokenType[TokenType["ERC20"] = 1] = "ERC20";
    TokenType[TokenType["ERC721"] = 2] = "ERC721";
})(TokenType || (TokenType = {}));
//# sourceMappingURL=token.js.map