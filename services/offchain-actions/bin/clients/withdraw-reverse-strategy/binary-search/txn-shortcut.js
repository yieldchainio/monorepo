import { encoding } from "../../../offchain-utils/generic-utils/Encoding.js";
const searchTxidShortcut = async (_provider, _contractAddress, _func, _funcToCall, _args, _abi, _executor, _transactionFunction) => {
    let result = await _transactionFunction(_provider, _contractAddress, _func, [
        "callback_post",
        [
            ...(await Promise.all(_args.map(async (arg) => await encoding(_provider, _contractAddress, arg.value, arg.solidity_type, _abi)))),
        ],
    ], _executor);
    return result;
};
export default searchTxidShortcut;
//# sourceMappingURL=txn-shortcut.js.map