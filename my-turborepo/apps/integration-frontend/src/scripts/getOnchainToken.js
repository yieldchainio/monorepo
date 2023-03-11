"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.classifyOnchainToken = void 0;
const axios_1 = __importDefault(require("axios"));
const ethers_1 = require("ethers");
const erc20abi_json_1 = __importDefault(require("./erc20abi.json"));
const classifyOnchainToken = async (address, network) => {
    console.log("Inside classifying token", address, network);
    if (!network.json_rpc) {
        console.log("NO json rpc serra");
        console.error("NO JSON RPC IN CLASSIFYONCHAIN TOKEN");
        return null;
    }
    try {
        address = ethers_1.ethers.getAddress(address);
    }
    catch (e) {
        console.log("INVALID ADDRESS IN CLASSIFYONCHAIN TOKEN");
        return null;
    }
    let provider = new ethers_1.ethers.JsonRpcProvider(network.json_rpc);
    console.log("Have provider in token", provider);
    let tokenContract = new ethers_1.ethers.Contract(address, erc20abi_json_1.default, provider);
    console.log("Have token contract in token", tokenContract);
    let name = await tokenContract.name();
    let symbol = await tokenContract.symbol();
    let decimals = await tokenContract.decimals();
    console.log("Got respones from contract", name, symbol, decimals);
    let object = {
        name: name,
        address: ethers_1.ethers.getAddress(address),
        symbol: symbol,
        decimals: parseInt(decimals),
        coinKey: symbol,
        priceUsd: null,
        chain_id: network.chain_id,
        markets: [],
    };
    console.log("Token Object", object);
    let tokenId = await (await axios_1.default.post("https://integrationapi.yieldchain.io/add-token/", object)).data.token_identifier;
    console.log("Got token id", tokenId);
    console.log("Did The Post Request on Token", tokenId);
    let newObject = {
        token_identifier: tokenId,
        name: name,
        address: ethers_1.ethers.getAddress(address),
        symbol: symbol,
        decimals: parseInt(decimals),
        coinkey: symbol,
        priceusd: 0,
        chain_id: network.chain_id,
        markets: [],
        logo: "",
    };
    return newObject;
};
exports.classifyOnchainToken = classifyOnchainToken;
//# sourceMappingURL=getOnchainToken.js.map