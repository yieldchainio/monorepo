import { DBNetwork, DBToken, TransposeTxnWithLogs } from "src/types";
import axios from "axios";
import { getAbi } from "./fetch-abi";
import { fetchTxns } from "./fetch-txns-transpose";
import { ethers } from "ethers";
import { mapFuncsToTxns } from "./map-funcs-to-txns";
import { IFlow, IFlowWithAmount, mapFuncsToFlows } from "./map-funcs-to-flows";
import { IFullArg, IFullFunction } from "src/App";
import { getTransactionHistory } from "./getTxnHistory";

export const getAddressDetails = async (
  address: string,
  network: DBNetwork
): Promise<{ functions: IFullFunction[]; abi: any[] }> => {
  // Address => checksum address
  try {
    address = ethers.getAddress(address);
  } catch (e: any) {
    alert("Invalid Address" + address);
    return { functions: [], abi: [] };
  }

  // The ABI of the address / it's underlying implementation contract
  const abi: any[] = await getAbi(
    address,
    network.block_explorer,
    network.json_rpc
  );

  // Filtering the ABI to include write-only functions
  const writeOnlyAbi = abi.filter((item: any) => {
    let isFunction = item.type === "function";
    let isWriteOnly =
      item.stateMutability === "nonpayable" ||
      item.stateMutability === "payable";
    return isFunction && isWriteOnly;
  });

  // Fetching a fixed amount of transactions from the address
  const transactions = (await fetchTxns(address, network)).filter(
    (txn: TransposeTxnWithLogs) => txn.__confirmed === true
  );

  console.log("Last Txn", transactions[transactions.length - 1]);

  // ID => Function Object Mapping
  const idToFuncMapping = new Map<number, Record<any, any>>();
  for (let i = 0; i < writeOnlyAbi.length; i++) {
    idToFuncMapping.set(i, writeOnlyAbi[i]);
    writeOnlyAbi[i].id = i;
  }

  // Functions => Transactions Mapping
  const funcsToTxnsMapping: Map<number, TransposeTxnWithLogs[]> =
    await mapFuncsToTxns(transactions, writeOnlyAbi, idToFuncMapping);

  // Number of transactions for each function
  const funcTxnCount = new Map<number, number>();
  for (let [funcId, txns] of funcsToTxnsMapping) {
    funcTxnCount.set(funcId, txns.length);
  }

  // Function ID => ERC20 Flows Mapping
  const idToFlowsMapping: Map<number, IFlow[]> = await mapFuncsToFlows(
    funcsToTxnsMapping,
    network
  );

  const fullFunctionsArray: IFullFunction[] = [];

  for (let [funcId, func] of idToFuncMapping) {
    let tempId: number = funcId;
    let funcName = func.name;
    let args = func.inputs.map((input: any, index: number) => {
      return {
        name: input.name,
        type: input.type,
        tempId: index,
        value: null,
        group_id: index,
      } as IFullArg;
    });

    // The Full Function Object
    let fullFunction: IFullFunction = {
      tempId: tempId,
      name: funcName,
      args: args,
      flows: idToFlowsMapping.get(tempId) || ([] as IFlow[]),
      txnsAmount: funcTxnCount.get(tempId) || 0,
      counterFuncId: null,
      unlockedByFuncId: null,
      chosen: false,
    };

    fullFunctionsArray.push(fullFunction);
  }

  return {
    functions: fullFunctionsArray.filter(
      (func: IFullFunction) => func.txnsAmount > 0
    ),
    abi: abi,
  };
};
