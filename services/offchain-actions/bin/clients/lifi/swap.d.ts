import { BytesLike } from "ethers";
import { address, EthersReceipt, ExtendedReceipt } from "../../offchain-types.js";
export declare const lifiswap: (_provider: string, _contractAddress: address, _operationFuncToCall: string, _args_bytes_arr: BytesLike[]) => Promise<ExtendedReceipt | EthersReceipt | null | undefined>;
