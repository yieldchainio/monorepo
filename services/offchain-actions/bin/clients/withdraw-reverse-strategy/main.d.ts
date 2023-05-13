import "dotenv/config.js";
import { ethers, BytesLike } from "ethers";
import { address } from "../../offchain-types.js";
export declare const reverseStrategy: (_inputtedProvider: string, _contractAddress: address, _funcToCall: string, _args_bytes_arr: BytesLike[]) => Promise<ethers.TransactionReceipt | null | undefined>;
