/**
 * Queue for sending transactions
 */
import { address } from "@yc/yc-models";
import { Wallet, Contract } from "ethers";
export declare class TriggersQueue {
    #private;
    constructor(signer: Wallet, diamondContract: Contract);
    push(vault: address, triggerIdx: number): void;
}
