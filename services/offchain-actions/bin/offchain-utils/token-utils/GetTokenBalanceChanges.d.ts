import { SimplifiedFunction, BaseTokensList, TokenBalancesMapping, EthersJsonRpcProvider, address, EthersExecutor } from "../../offchain-types.js";
import GenericOrchestrator from "../../sqs-class.js";
export declare const getBalancesChanges: (_provider: EthersJsonRpcProvider, _contractAddress: address, _tokensList: BaseTokensList, _transactionToExecute: {
    to: address;
    function: SimplifiedFunction;
    args: any[];
}, _executor: EthersExecutor, _ignoreTxns?: GenericOrchestrator) => Promise<TokenBalancesMapping>;
