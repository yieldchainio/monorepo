"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenDetails = void 0;
const axios_1 = __importDefault(require("axios"));
const ethers_1 = require("ethers");
const getOnchainToken_1 = require("./getOnchainToken");
const getTokenDetails = async (_token_address, _network) => {
    let allTokens = await axios_1.default.get("https://api.yieldchain.io/tokens");
    let tokenDetails = allTokens.data.tokens.find((token) => ethers_1.ethers.getAddress(token.address) === ethers_1.ethers.getAddress(_token_address));
    if (tokenDetails == undefined) {
        // Get it's details and add it to the DB
        await (0, getOnchainToken_1.classifyOnchainToken)(_token_address, _network);
    }
};
exports.getTokenDetails = getTokenDetails;
//# sourceMappingURL=getTokenDetails.js.map