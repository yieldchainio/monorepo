/**
 * Base class that can be extended by any other, with generic merthods
 */
import { ContractTransaction, TransactionReceipt } from "ethers";
import { SignerMethod } from "../../types/index.js";
/**
 * Another base class which has base web3 functionality to support bothbackends and frontneds
 */
export declare class BaseWeb3Class {
    signTransaction: (signingMethod: SignerMethod, transaction: ContractTransaction) => Promise<TransactionReceipt>;
    static signTransaction: (signingMethod: SignerMethod, transaction: ContractTransaction) => Promise<TransactionReceipt>;
    signTransactions: (signingMethod: SignerMethod, transactions: ContractTransaction[]) => Promise<TransactionReceipt[]>;
    getSigningAddress: (signingMethod: SignerMethod) => string;
    static getSigningAddress: (signingMethod: SignerMethod) => string;
}
export declare class BaseClass extends BaseWeb3Class {
    toJSON(): any;
    stringify(): string;
    compare(_instance: BaseClass): boolean;
    protected assert: (condition: boolean, error: string) => void;
}
