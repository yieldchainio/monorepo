"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapFuncsToFlows = void 0;
const ethers_1 = require("ethers");
const axios_1 = __importDefault(require("axios"));
const getOnchainToken_1 = require("./getOnchainToken");
/**
 * Maps Function IDs to ERC20 Flows - Using a FuntionID => Transactions Mapping
 * @param _funcsToTxns
 * @returns
 */
const mapFuncsToFlows = async (_funcsToTxns, _network) => {
    // Initialize the mapping
    let idToFlowsMapping = new Map();
    // A Mapping of Transaction Hash => Flows
    let txnToFlows = new Map();
    // All tokens
    let allTokens = await (await axios_1.default.get("https://api.yieldchain.io/tokens")).data.tokens;
    // Returns a token's details
    const getTokenDetails = async (address) => {
        let tokenDetails = allTokens.find((token) => ethers_1.ethers.getAddress(token.address) == ethers_1.ethers.getAddress(address) &&
            token.chain_id == _network.chain_id);
        // If we can't find the token's details, we get it's details onchain & add it to the DB
        if (tokenDetails === undefined) {
            tokenDetails = await (0, getOnchainToken_1.classifyOnchainToken)(address, _network);
            // Push it into the array so that we do not re-add it
            allTokens.push(tokenDetails);
        }
        return tokenDetails;
    };
    let i = 0;
    // Iterate over each function
    for (let [funcId, txns] of _funcsToTxns) {
        for (let txn of txns) {
            // If the topic 0 is an ERC20 transfer event
            if (txn.topic_0 ==
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef") {
                // @Typeguard - If the topic 0 is an ERC20 transfer event, then the topic 1 and topic 2 must be present
                if (txn.topic_1 == null || txn.topic_2 == null)
                    continue;
                // The token address
                // @Typeguard - If the topic 0 is an ERC20 transfer event, then the address must be present as a string
                let tokenAddress = txn.address;
                // The Token Details
                let tokenDetails = await getTokenDetails(tokenAddress);
                // @Typeguard
                if (tokenDetails == undefined)
                    continue;
                // From Address
                let fromAddress = ethers_1.ethers.AbiCoder.defaultAbiCoder().decode(["address"], txn.topic_1)[0];
                // To Address
                let toAddress = ethers_1.ethers.AbiCoder.defaultAbiCoder().decode(["address"], txn.topic_2)[0];
                // Transfer Amount
                let flowAmount = BigInt(ethers_1.ethers.AbiCoder.defaultAbiCoder().decode(["uint256"], txn.data)[0]);
                // The address that initiated the txn
                let from = txn.from_address;
                // Whether this log has inflowed out of the initiating user or into it
                let outflow0_or_inflow1 = fromAddress === from ? 0 : toAddress === from ? 1 : null;
                if (outflow0_or_inflow1 === null)
                    continue;
                // Also set flows per TXN - To later on filter out 'internal' transfers
                let prevTxnFlows = txnToFlows.get(txn.transaction_hash) || [];
                // Spreading the previous transfers into a new array
                let newTxnArr = [...prevTxnFlows];
                // The index of the current flow in the new array (if any)
                let txnIndex = newTxnArr.findIndex((flow) => {
                    if (flow === undefined || flow.token_details === undefined)
                        return false;
                    if (tokenDetails === undefined)
                        return false;
                    return (flow.token_details.token_identifier ===
                        tokenDetails.token_identifier &&
                        flow.outflow0_or_inflow1 === outflow0_or_inflow1);
                });
                // If we found the flow's index (i.e does not equal to -1), we change the total token amount
                // and also add 1 to the "percentage of txns" - which for now just counts the amount of txns
                // that relate to this flow, and will later on be interchanged to the actual percentage once
                // we have iterated over all of them
                if (txnIndex !== -1) {
                    newTxnArr[txnIndex].amount += flowAmount;
                    newTxnArr[txnIndex].percentageOfFuncTxns += 1;
                    // Else, we push the flow
                }
                else
                    newTxnArr.push({
                        token_details: tokenDetails,
                        outflow0_or_inflow1: outflow0_or_inflow1,
                        percentageOfFuncTxns: 1,
                        amount: flowAmount,
                    });
                // We set the new array of flows for the txn hash in our mapping
                txnToFlows.set(txn.transaction_hash, newTxnArr);
            }
        }
    }
    // Iterating over each Function => Txn Arr again
    for (const [funcId, txnsArr] of _funcsToTxns) {
        // Shorthand
        let txns = txnsArr;
        // Total number of transactions (to be used to calculate the percentage of txns each flow is present in)
        let totalTxns = txns.length || 0;
        // A 2d array of flows
        let txnFlowsArr = [];
        // Mapping txns => flows (With Amounts)
        let txidsToFlows = txns.map((txn) => txnToFlows.get(txn.transaction_hash) || null);
        // Iterating over each txn's array of flows
        for (let i = 0; i < txidsToFlows.length; i++) {
            // A mapping that maps token IDs to total transfer amounts.
            // This will be used to calculate whether a flow is absolute (i.e, there was an actual transfer of value
            // between two addresses, and not just an internal transfer) - For instance if i got 100 ETH tokens,
            // And then i was deducted 100 ETH tokens, there was no actual flow of ETH tokens within the txn.
            // If this was not filtered out, the admin would see that there was an inflow and an outflow of ETH tokens,
            // while in reality, neither is true.
            let tokenToAmt = new Map();
            // The flows array being iterated on
            let flows = txidsToFlows[i] || [];
            // The new array of flows that will be pushed to the 2d array
            let newArr = [];
            // Iterating over each flow, setting for each token identifier the total amount of tokens transferred
            // within the entire txn (again, used to calculate total inflow/outflow)
            for (const flow of flows) {
                if (flow === undefined || flow.token_details === undefined)
                    continue;
                let token = flow.token_details.token_identifier;
                let amt = flow.amount;
                let prevAmt = tokenToAmt.get(token) || 0n;
                tokenToAmt.set(token, prevAmt + amt);
            }
            // Iterating over out token ID => amount mapping, filtering out ones that are not absolute flows
            // (with the criteria for non-absolute flows to be bigger than -10 or smaller than 10, which can be interchanged.
            // It is assumed that such a small amount (assuming big numbers are used) is not a real transfer. We can use 0,
            // but then we risk not filtering internal transfers that somehow left some dust)
            for (const [token, amt] of tokenToAmt) {
                // If (v close to 0)
                if (amt > 10n || amt < -10n) {
                    // All of the flows that have the same token ID as the token being iterated over currently
                    let tokenFlows = flows.filter((flow) => flow.token_details.token_identifier == token);
                    // For each one of these, we push it into the new array (since, we know that there was an actual
                    // transfer of value of this token within the txn)
                    tokenFlows.forEach((flow) => newArr.push(flow));
                }
                else {
                    console.log("Found Add Liquidity Flow That Will Be Emitted, Token Address:", token, "Amount:", amt);
                }
            }
            // Pushing the new array of flows to the 2d array
            txnFlowsArr[i] = newArr;
        }
        // Making sure none are undefined, and filtering out empty arrays
        txnFlowsArr = txnFlowsArr.filter((flow) => flow.filter((_flow) => _flow !== (undefined || null))
            .length > 0);
        // Setting for each flow, the percentage of the total transactions
        for (const flows of txnFlowsArr) {
            // @Typeguard
            if (flows === null)
                continue;
            // For each flow (in the array of flows being iterated over)
            for (const flow of flows) {
                // Finding the txns that share the same flow (same token & same flow direction), getting the length
                // of this new list
                let txnsWithSameFlow = txnFlowsArr.filter((_flows) => _flows !== null &&
                    _flows.find((_flow) => _flow !== null &&
                        _flow.token_details.token_identifier ===
                            flow.token_details.token_identifier &&
                        _flow.outflow0_or_inflow1 === flow.outflow0_or_inflow1) !== undefined).length;
                // The percentage of txns that the flow is present in === the total txns that flow was found in,
                // divided by the total number of txns, multiplied by 100 (e.g, 50 txns found / 100 total txns * 100 = 50%)
                flow.percentageOfFuncTxns = (txnsWithSameFlow / totalTxns) * 100;
            }
        }
        // 2D array => 1D array
        let newArr = [];
        for (let i = 0; i < txnFlowsArr.length; i++) {
            for (let j = 0; j < txnFlowsArr[i].length; j++) {
                newArr.push(txnFlowsArr[i][j]);
            }
        }
        // Removing duplicates
        newArr = newArr.filter((flow, index) => {
            let indexOfFlow = newArr.findIndex((_flow) => _flow.outflow0_or_inflow1 == flow.outflow0_or_inflow1 &&
                _flow.token_details.token_identifier ==
                    flow.token_details.token_identifier);
            if (indexOfFlow === index)
                return true;
            else
                return false;
        });
        // Setting the new, 1D array
        idToFlowsMapping.set(funcId, newArr);
    }
    // Return our mapping
    return idToFlowsMapping;
};
exports.mapFuncsToFlows = mapFuncsToFlows;
//# sourceMappingURL=map-funcs-to-flows.js.map