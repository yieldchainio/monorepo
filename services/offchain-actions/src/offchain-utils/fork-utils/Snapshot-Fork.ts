import { ethers } from "ethers";
import { EthersJsonRpcProvider } from "../../offchain-types.js";
import createFork from "./Create-Fork.js";
import { ForkResponse } from "./fork-types.js";

export const forkSnapshot = async (
  _provider: EthersJsonRpcProvider
): Promise<ForkResponse> => {
  let blockNumber = await _provider.getBlockNumber();
  let chain_id = parseInt((await _provider.getNetwork()).chainId.toString());

  let newForkOptions = {
    chain: {
      chainId: chain_id,
    },
    fork: {
      url: _provider._getConnection().url,
      blockNumber: blockNumber,
    },
  };
  let fork: ForkResponse = await createFork(newForkOptions);
  let forkId = fork.fork_id;
  let forkSecretId = fork.requester_id;
  let forkJsonRpc = fork.json_rpc_url;

  return fork;
};
