import axios from "axios";
import { ethers } from "ethers";
export default class LiFi {
    // ====================
    //    PRIVATE FIELDS
    // ====================
    #apiURL;
    // ====================
    //     SINGLETON
    // ====================
    static instance;
    // ====================
    //     CONSTRUCTOR
    // ====================
    constructor() {
        this.#apiURL = "https://li.quest/v1";
        if (!LiFi.instance)
            LiFi.instance = new LiFi();
        return LiFi.instance;
    }
    // ====================
    //     READ METHODS
    // ====================
    // Get full token info
    tokenInfo = async (_token) => {
        let chainid = _token.network()?.chainid;
        if (!chainid)
            return null;
        return await (await axios.get(this.#apiURL + `/token?chain=${chainid}&token=${_token.address()}`)).data;
    };
    // Get a USD Price of a token
    getUSDPrice = async (_token) => {
        let info = await this.tokenInfo(_token);
        if (!info || !info.priceUSD)
            return null;
        return parseFloat(info.priceUSD);
    };
    // Get a quote
    getFullQuote = async (_fromToken, _toToken, _amount, _sender, _toChain, _receiver) => {
        let fromChainId = _fromToken.network()?.chainid;
        let toChainId = _toToken.network()?.chainid;
        if (!fromChainId || !toChainId)
            return null;
        let quote = null;
        // Sometimes the amount is too low and we gotta retry a couple of times
        let retries = 0;
        try {
            quote = await (await axios.get(this.#apiURL +
                `/quote?fromChain=${fromChainId}&toChain=${toChainId}&fromToken=${_fromToken.address()}&toToken=${_toToken.address()}&fromAddress=${_sender || ethers.ZeroAddress}&toAddress=${_receiver || _sender || ethers.ZeroAddress}&fromAmount=${_amount || _fromToken.parseDecimals(1)}`)).data;
        }
        catch (e) {
            retries++;
            return this.getFullQuote(_fromToken, _toToken, _amount, _sender, _toChain, _receiver);
        }
        return quote;
    };
    // Get price against another token
    getTokenPrice = async (_fromToken, _toToken) => {
        // Quote of 1 fromToken => toToken
        let fullQuote = await this.getFullQuote(_fromToken, _toToken);
        if (fullQuote == null)
            return null;
        return parseFloat(fullQuote.estimate.toAmount);
    };
}
var QuoteResType;
(function (QuoteResType) {
    QuoteResType["SWAP"] = "swap";
    QuoteResType["CROSS"] = "cross";
    QuoteResType["LIFI"] = "lifi";
})(QuoteResType || (QuoteResType = {}));
var GasFeeTypes;
(function (GasFeeTypes) {
    GasFeeTypes["SUM"] = "SUM";
    GasFeeTypes["APPROVE"] = "APPROVE";
    GasFeeTypes["SEND"] = "SEND";
})(GasFeeTypes || (GasFeeTypes = {}));
//# sourceMappingURL=lifi.js.map