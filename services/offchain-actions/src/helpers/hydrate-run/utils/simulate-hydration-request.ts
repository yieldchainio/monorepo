import {
  Contract,
  JsonRpcProvider,
  Wallet,
  ZeroAddress,
  JsonRpcSigner,
  ZeroHash,
} from "ethers";
import { RequestFullfillEvent } from "../../../types.js";
import {
  REQUEST_FULLFILL_ONCHAIN_EVENT_HASH,
  YcCommand,
  address,
  bytes,
} from "@yc/yc-models";
import { FulfillRequest } from "../../fulfill-action/index.js";
import DiamondABI from "@yc/yc-models/src/ABIs/diamond.json" assert { type: "json" };
import VaultABI from "@yc/yc-models/src/ABIs/strategy.json" assert { type: "json" };
import { HydrationRequest } from "../classes/hydration-request.js";
import dotenv from "dotenv";
import { createFork } from "../../../utils/create-fork.js";
import { OperationItem } from "../../../types.js";
import { Fork } from "@yc/anvil-ts";
dotenv.config();

/**
 * @notice
 * Simulate an operation item run, hydrate an array of YC commands, and return them
 * @param hydrationRequest - The hydration request to simulate
 * @param network - A supported YC Network, will be used to create a fork
 * @return hydratedCommands - An array of commands hydrated from the offchain actions
 */

export async function simulateHydrationRequest(
  hydrationRequest: HydrationRequest
): Promise<Array<YcCommand>> {
  if (!process.env.PRIVATE_KEY)
    throw "Cannot COmplete Hydration Request - Private Key Undefined";

  const network = hydrationRequest.network;

  const fork = await createFork(network);
  await fork.enableLog();

  await fork.prank(ZeroAddress as address);
  await fork.autoClownster();

  console.log("eth_accounts", await fork.send("anvil_nodeInfo", []));

  const signer = new JsonRpcSigner(fork, ZeroAddress);

  const strategyContract = new Contract(
    hydrationRequest.strategyAddress,
    VaultABI,
    signer
  );

  const forkStat = await strategyContract.setForkStatus.populateTransaction();

  await signer.sendTransaction(forkStat);

  const commandCalldatas = await recursivelyExecAndHydrateRun(
    strategyContract,
    hydrationRequest.operationIndex,
    await hydrationRequest.getGasLimit(fork),
    fork
  );

  await fork.kill();

  return commandCalldatas.map(
    (value: YcCommand | undefined) => value || ZeroHash
  );
}

/**
 * Used to make a recursive run simulation,
 * where the hydrateAndExecuteRun() function is called,
 * and all of the RequestFullfill logs are pushed into an array, processed,
 * then the execution recurses with the newly hydrated commands. Execution stops
 * when the request fullfill logs array are empty
 * @param strategyAddress - The address of the strategy
 * @param diamondAddress - Contract instance of the diamond on that network
 * @param operationIdx - The index of the operation
 * @param commandCalldatas - The existing command calldatas (shall only have items when recursed)
 * @param fork - A fork of the original network
 * @return commandCalldatas - The array of command calldatas
 */
async function recursivelyExecAndHydrateRun(
  strategyContract: Contract,
  operationIdx: bigint,
  gasLimit: bigint,
  fork: Fork,
  commandCalldatas: Array<YcCommand | undefined> = [],
  startingIndices: number[] = [0]
): Promise<Array<YcCommand | undefined>> {
  await fork.snap();

  const receipt = await (
    await strategyContract.simulateOperationHydrationAndExecution.send(
      operationIdx,
      startingIndices,
      commandCalldatas,
      {
        gasLimit: gasLimit,
      }
    )
  ).wait();

  if (!receipt)
    throw "Cannot Recursively Hydrate Run - Sent Execution Run On Fork, But Receipt Is Null.";

  if (!receipt.status)
    throw "Cannot Recurisvely Hydrate Run - Sent Transaction On Fork, Execution Reverted";

  const strategyAddress = await strategyContract.getAddress();

  const fullfillRequests: RequestFullfillEvent[] = receipt.logs.filter(
    (log) =>
      log.topics[0] == REQUEST_FULLFILL_ONCHAIN_EVENT_HASH &&
      log.address == strategyAddress
  ) as RequestFullfillEvent[];

  startingIndices = [];
  for (const actionRequestEvent of fullfillRequests) {
    const fullfillRequest = new FulfillRequest(actionRequestEvent, fork);
    const hydratedCommand = await fullfillRequest.fulfill();
    console.log(
      "Fullfilled! Hydrated Command:",
      hydratedCommand?.slice(0, 4) +
        "..." +
        hydratedCommand?.slice(
          hydratedCommand.length - 4,
          hydratedCommand.length
        )
    );
    const stepIndex = fullfillRequest.stepIndex
      ? parseInt(fullfillRequest.stepIndex.toString())
      : null;

    if (!hydratedCommand)
      throw "Cannot Hydrate Run - Action Returned Undefined.";

    if (typeof stepIndex !== "number")
      throw "Cannot Hydrate Run - Step Index Is undefined " + stepIndex;

    commandCalldatas[stepIndex] = hydratedCommand;
    startingIndices.push(stepIndex);
  }

  if (fullfillRequests.length > 0) {
    await fork.rollback();
    for (let i = 0; i < commandCalldatas.length; i++)
      if (!commandCalldatas[i]) commandCalldatas[i] = ZeroHash;

    return recursivelyExecAndHydrateRun(
      strategyContract,
      operationIdx,
      gasLimit,
      fork,
      commandCalldatas,
      startingIndices
    );
  } else console.log("Finished Simulations. Gonna Execute Onchain...");
  return commandCalldatas;
}
