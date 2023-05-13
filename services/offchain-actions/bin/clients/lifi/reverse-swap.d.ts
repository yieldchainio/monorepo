import { BytesLike } from "ethers";
import { address } from "../../offchain-types.js";
export declare const reverseLifiSwap: (_provider: string, _contractAddress: address, _operationFuncToCall: string, _args_bytes_arr: BytesLike[]) => Promise<import("../../offchain-types.js").ExtendedReceipt | import("../../offchain-types.js").EthersReceipt | null | undefined>;
