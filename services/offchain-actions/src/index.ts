import dotenv from "dotenv";
dotenv.config();
import { SQSQueue } from "@yc/aws-models";
import {
  OFFCHAIN_EXECUTION_REQUESTS_QUEUE_URL,
  SupportedYCNetwork,
  YCClassifications,
} from "@yc/yc-models";
import { SQSHydrationRequestEvent } from "./types.js";
import { Contract, JsonRpcProvider, Wallet } from "ethers";
import { HydrationRequest } from "./helpers/hydrate-run";
import DiamondABI from "@yc/yc-models/src/ABIs/diamond.json" assert { type: "json" };

const offchainRequestsQueue = new SQSQueue<SQSHydrationRequestEvent>(
  OFFCHAIN_EXECUTION_REQUESTS_QUEUE_URL
);

const ycContext = YCClassifications.getInstance();
if (!ycContext.initiallized) await ycContext.initiallize();

const hydrationRequestHandler = async (
  hydrationRequest: SQSHydrationRequestEvent
): Promise<boolean> => {
  const network = ycContext.networks.find(
    (network) => network.jsonRpc == hydrationRequest.rpc_url
  );

  if (!network || !network.diamondAddress || !network.provider) {
    console.error(
      "Cannot Handle Hydration Run Request - Network Is Unsupported.",
      hydrationRequest.rpc_url,
      "Network:",
      network
    );
    return false;
  }

  const hydrationInstance = new HydrationRequest(
    hydrationRequest.log,
    network as SupportedYCNetwork
  );

  const hydratedCommands = await hydrationInstance.simulateHydration();

  if (!process.env.PRIVATE_KEY) {
    console.error(
      "Cannot Process Hydration Run Request - Private Key Of Executor Is Undefined"
    );
    return false;
  }

  const executor = new Wallet(process.env.PRIVATE_KEY, network.provider);

  const diamondContract = new Contract(
    network.diamondAddress,
    DiamondABI,
    executor
  );

  const res = await (
    await diamondContract.hydrateAndExecuteRun.send(
      hydrationInstance.strategyAddress,
      hydrationInstance.operationIndex,
      hydratedCommands
    )
  ).wait();

  return !!res;
};

offchainRequestsQueue.listen(hydrationRequestHandler);
