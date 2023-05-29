/**
 * Base class that can be extended by any other, with generic merthods
 */
import { EthersExecutor, } from "../../types/index.js";
import { safeToJSON } from "../../helpers/index.js";
import { YCClassifications } from "../context/context.js";
/**
 * Another base class which has base web3 functionality to support bothbackends and frontneds
 */
class BaseWeb3Class {
    // Send a transaction with either a signer or a callback that signs populated transactions
    signTransaction = async (signingMethod, transaction) => {
        // If we got a callback as the signing method, we call it with the requests. Otherwise,
        // we got a signer so we make a function that sends the transaction to it
        const _signTransaction = signingMethod instanceof EthersExecutor
            ? async (req) => await signingMethod.sendTransaction(req)
            : signingMethod.executionCallback;
        const res = await _signTransaction(transaction);
        const network = signingMethod instanceof EthersExecutor
            ? null
            : YCClassifications.getInstance().getNetwork(signingMethod.chainID);
        const provider = network
            ? network.provider
            : signingMethod.provider;
        if (!provider)
            throw "Cannot Return Receipt - Provider Undefined";
        const receipt = await provider.getTransactionReceipt(res.hash);
        if (!receipt)
            throw "Receipt Is Null When Sending Txn";
        return receipt;
    };
    static signTransaction = async (signingMethod, transaction) => {
        // If we got a callback as the signing method, we call it with the requests. Otherwise,
        // we got a signer so we make a function that sends the transaction to it
        const _signTransaction = signingMethod instanceof EthersExecutor
            ? async (req) => await signingMethod.sendTransaction(req)
            : signingMethod.executionCallback;
        const res = await _signTransaction(transaction);
        const network = signingMethod instanceof EthersExecutor
            ? null
            : YCClassifications.getInstance().getNetwork(signingMethod.chainID);
        const provider = network
            ? network.provider
            : signingMethod.provider;
        if (!provider)
            throw "Cannot Return Receipt - Provider Undefined";
        await provider.waitForTransaction(res.hash);
        const receipt = await provider.getTransactionReceipt(res.hash);
        if (receipt == null)
            throw "Receipt Is Null When Sending Txn. Hash: " + res.hash;
        return receipt;
    };
    // Send multiple transactions
    signTransactions = async (signingMethod, transactions) => {
        // If we got a callback as the signing method, we call it with the requests. Otherwise,
        // we got a signer so we make a function that sends the transaction to it
        const _signTransaction = signingMethod instanceof EthersExecutor
            ? async (req) => await signingMethod.sendTransaction(req)
            : signingMethod.executionCallback;
        // An array of all the respones
        const receipts = [];
        const network = signingMethod instanceof EthersExecutor
            ? null
            : YCClassifications.getInstance().getNetwork(signingMethod.chainID);
        const provider = network
            ? network.provider
            : signingMethod.provider;
        if (!provider)
            throw "Cannot Return Receipt - Provider Undefined";
        // Iterate and call our function, push each receipt to an array
        for (const transactionRequest of transactions) {
            const txn = await _signTransaction(transactionRequest);
            if (signingMethod instanceof EthersExecutor)
                signingMethod.provider?.waitForTransaction(txn.hash);
            const receipt = await provider.getTransactionReceipt(txn.hash);
            if (!receipt)
                throw "Receipt Is Null When Sending Txn";
            receipts.push(receipt);
        }
        return receipts;
    };
    // Get a signer's address from a SignerMethod
    getSigningAddress = (signingMethod) => {
        if (signingMethod instanceof EthersExecutor)
            return signingMethod.address;
        return signingMethod.from;
    };
    static getSigningAddress = (signingMethod) => {
        if (signingMethod instanceof EthersExecutor)
            return signingMethod.address;
        return signingMethod.from;
    };
}
export { BaseWeb3Class };
export class BaseClass extends BaseWeb3Class {
    // instanceID: string;
    // constructor() {
    //   super();
    //   this.instanceID = uuid();
    // }
    // Method to convert the class ,including it's getters - to JSON.
    toJSON() {
        return safeToJSON(this);
    }
    // Method to turn the object into a stringified version
    stringify() {
        return JSON.stringify(this.toJSON());
    }
    // Method to compare an instance of this class with another one
    compare(_instance) {
        return this.stringify() === _instance.stringify();
    }
    // An assertion function that checks a condition and throws an error if it's not met
    assert = (condition, error) => {
        if (!condition)
            throw new Error(error);
    };
}
//# sourceMappingURL=index.js.map