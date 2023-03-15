"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressDetails = void 0;
const fetch_abi_1 = require("./fetch-abi");
const fetch_txns_transpose_1 = require("./fetch-txns-transpose");
const ethers_1 = require("ethers");
const map_funcs_to_txns_1 = require("./map-funcs-to-txns");
const map_funcs_to_flows_1 = require("./map-funcs-to-flows");
const getAddressDetails = async (address, network) => {
    // Address => checksum address
    try {
        address = ethers_1.ethers.getAddress(address);
    }
    catch (e) {
        alert("Invalid Address" + address);
        return { functions: [], abi: [] };
    }
    // The ABI of the address / it's underlying implementation contract
    const abi = await (0, fetch_abi_1.getAbi)(address, network.block_explorer, network.json_rpc);
    // Filtering the ABI to include write-only functions
    const writeOnlyAbi = abi.filter((item) => {
        let isFunction = item.type === "function";
        let isWriteOnly = item.stateMutability === "nonpayable" ||
            item.stateMutability === "payable";
        return isFunction && isWriteOnly;
    });
    // Fetching a fixed amount of transactions from the address
    const transactions = (await (0, fetch_txns_transpose_1.fetchTxns)(address, network)).filter((txn) => txn.__confirmed === true);
    console.log("Last Txn", transactions[transactions.length - 1]);
    // ID => Function Object Mapping
    const idToFuncMapping = new Map();
    for (let i = 0; i < writeOnlyAbi.length; i++) {
        idToFuncMapping.set(i, writeOnlyAbi[i]);
        writeOnlyAbi[i].id = i;
    }
    // Functions => Transactions Mapping
    const funcsToTxnsMapping = await (0, map_funcs_to_txns_1.mapFuncsToTxns)(transactions, writeOnlyAbi, idToFuncMapping);
    // Number of transactions for each function
    const funcTxnCount = new Map();
    for (let [funcId, txns] of funcsToTxnsMapping) {
        funcTxnCount.set(funcId, txns.length);
    }
    // Function ID => ERC20 Flows Mapping
    const idToFlowsMapping = await (0, map_funcs_to_flows_1.mapFuncsToFlows)(funcsToTxnsMapping, network);
    const fullFunctionsArray = [];
    for (let [funcId, func] of idToFuncMapping) {
        let tempId = funcId;
        let funcName = func.name;
        let args = func.inputs.map((input, index) => {
            return {
                name: input.name,
                type: input.type,
                tempId: index,
                value: null,
                group_id: index,
            };
        });
        // The Full Function Object
        let fullFunction = {
            tempId: tempId,
            name: funcName,
            args: args,
            flows: idToFlowsMapping.get(tempId) || [],
            txnsAmount: funcTxnCount.get(tempId) || 0,
            counterFuncId: null,
            unlockedByFuncId: null,
            chosen: false,
        };
        fullFunctionsArray.push(fullFunction);
    }
    return {
        functions: fullFunctionsArray.filter((func) => func.txnsAmount > 0),
        abi: abi,
    };
};
exports.getAddressDetails = getAddressDetails;
//# sourceMappingURL=get-address-details.js.map