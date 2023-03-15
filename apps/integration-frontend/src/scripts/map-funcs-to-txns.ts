import { TransposeTxnWithLogs } from "src/types";
import { ethers } from "ethers";

export const mapFuncsToTxns = async (
  _txns: TransposeTxnWithLogs[],
  _abi: any,
  _idToFuncMapping: Map<number, Record<any, any>>
): Promise<Map<number, TransposeTxnWithLogs[]>> => {
  let funcsToTxnsMapping = new Map<number, TransposeTxnWithLogs[]>();
  for (let [funcId, func] of _idToFuncMapping) {
    funcsToTxnsMapping.set(funcId, []);
  }
  let iface = new ethers.Interface(_abi);
  for (let i = 0; i < _txns.length; i++) {
    // The current TXN being iterated over
    let currentTxn = _txns[i];

    // The inputted encoded data of the txn
    let data = currentTxn.input;
    // Encoded ether value
    let value = BigInt(currentTxn.value);

    // Decoded data
    let decodedData = iface.parseTransaction({ data: data, value: value });

    // If the decoded data is null, continue (was not calling any function)
    if (decodedData === null) continue;

    // Function Name
    let functionName = decodedData.name;

    // If the function name is null, continue (was not calling any function)
    if (functionName === (undefined || null || "")) continue;

    // The ID of the function
    let funcId = _abi.find((item: any) => item.name === functionName).id;

    // Previous Transactions mapped to the function ID
    let prevTxns = funcsToTxnsMapping.get(funcId);

    // Append the new txn into the mapping
    if (prevTxns === undefined || prevTxns.length === 0)
      funcsToTxnsMapping.set(funcId, [currentTxn]);
    else funcsToTxnsMapping.set(funcId, [...prevTxns, currentTxn]);
  }

  const actualMapping = new Map<number, TransposeTxnWithLogs[]>();
  for (let [funcId, txns] of funcsToTxnsMapping) {
    if (txns.length > 0) actualMapping.set(funcId, txns);
  }
  return actualMapping;
};
