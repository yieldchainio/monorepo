import { ethers } from "ethers";
import { address } from "../../offchain-types.js";
export declare const manualWithdraw: (_tokenAddress: address, _contractAddress: address, _destination: address, _amount: string, _json_rpc_url: string) => Promise<ethers.TransactionResponse>;
