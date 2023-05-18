import { Contract, ZeroHash, } from "ethers";
import { REQUEST_FULLFILL_ONCHAIN_EVENT_HASH, } from "@yc/yc-models";
import { FulfillRequest } from "../../fulfill-action/index.js";
import VaultABI from "@yc/yc-models/src/ABIs/strategy.json" assert { type: "json" };
import dotenv from "dotenv";
import { createFork } from "../../../utils/create-fork.js";
dotenv.config();
/**
 * @notice
 * Simulate an operation item run, hydrate an array of YC commands, and return them
 * @param hydrationRequest - The hydration request to simulate
 * @param network - A supported YC Network, will be used to create a fork
 * @return hydratedCommands - An array of commands hydrated from the offchain actions
 */
export async function simulateHydrationRequest(hydrationRequest) {
    if (!process.env.PRIVATE_KEY)
        throw "Cannot COmplete Hydration Request - Private Key Undefined";
    const network = hydrationRequest.network;
    const fork = await createFork(network);
    const strategyContract = new Contract(hydrationRequest.strategyAddress, VaultABI, fork);
    await strategyContract.setForkStatus({
        from: network.diamondAddress,
    });
    const operationRequest = await hydrationRequest.getOperation();
    if (!operationRequest)
        throw "Cannot Simulate Hydration Request - Operation Request Non Existant";
    const virtualTree = await strategyContract.getVirtualStepsTree(operationRequest?.action);
    const commandCalldatas = await recursivelyExecAndHydrateRun(network.diamondAddress, strategyContract, virtualTree, operationRequest, fork);
    return commandCalldatas.map((value) => value || ZeroHash);
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
async function recursivelyExecAndHydrateRun(diamondAddress, strategyContract, virtualStepsTree, operationRequest, fork, commandCalldatas = [], startingIndices = [0]) {
    const receipt = await (await strategyContract.executeStepsTree.send(virtualStepsTree, startingIndices, operationRequest, {
        from: diamondAddress,
    })).wait();
    if (!receipt)
        throw "Cannot Recursively Hydrate Run - Sent Execution Run On Fork, But Receipt Is Null.";
    const fullfillRequests = receipt.logs.filter((log) => log.topics[0] == REQUEST_FULLFILL_ONCHAIN_EVENT_HASH &&
        log.address == strategyContract.target);
    startingIndices = [];
    for (const actionRequestEvent of fullfillRequests) {
        const fullfillRequest = new FulfillRequest(actionRequestEvent, fork);
        const hydratedCommand = await fullfillRequest.fulfill();
        const stepIndex = fullfillRequest.stepIndex;
        if (!hydratedCommand)
            throw "Cannot Hydrate Run - Action Returned Undefined.";
        if (typeof stepIndex !== "number")
            throw "Cannot Hydrate Run - Step Index Is undefined " + stepIndex;
        commandCalldatas[stepIndex] = hydratedCommand;
        startingIndices.push(stepIndex);
    }
    if (fullfillRequests.length > 0)
        return recursivelyExecAndHydrateRun(diamondAddress, strategyContract, virtualStepsTree, operationRequest, fork, commandCalldatas, startingIndices);
    return commandCalldatas;
}
//# sourceMappingURL=simulate-hydration-request.js.map