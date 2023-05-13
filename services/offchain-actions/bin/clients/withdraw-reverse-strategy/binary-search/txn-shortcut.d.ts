import { address, EthersExecutor, EthersJsonRpcProvider, EthersReceipt, ExtendedReceipt, SimplifiedFunction } from "../../../offchain-types";
declare const searchTxidShortcut: (_provider: EthersJsonRpcProvider, _contractAddress: address, _func: SimplifiedFunction, _funcToCall: string, _args: any[], _abi: any, _executor: EthersExecutor, _transactionFunction: Function) => Promise<EthersReceipt | ExtendedReceipt | null>;
export default searchTxidShortcut;
