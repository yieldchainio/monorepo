import dotenv from "dotenv";
dotenv.config();
import { SQSQueue } from "@yc/aws-models";
import { OFFCHAIN_EXECUTION_REQUESTS_QUEUE_URL, YCClassifications, } from "@yc/yc-models";
import { Contract, Wallet } from "ethers";
import { HydrationRequest } from "./helpers/hydrate-run/index.js";
import DiamondABI from "@yc/yc-models/src/ABIs/diamond.json" assert { type: "json" };
const offchainRequestsQueue = new SQSQueue(OFFCHAIN_EXECUTION_REQUESTS_QUEUE_URL);
const ycContext = YCClassifications.getInstance();
if (!ycContext.initiallized)
    await ycContext.initiallize();
const hydrationRequestHandler = async (hydrationRequest) => {
    const network = ycContext.networks.find((network) => network.jsonRpc == hydrationRequest.rpc_url);
    if (!network || !network.diamondAddress || !network.provider) {
        console.error("Cannot Handle Hydration Run Request - Network Is Unsupported.", hydrationRequest.rpc_url, "Network:", network);
        return false;
    }
    const hydrationInstance = new HydrationRequest(hydrationRequest.log, network);
    const hydratedCommands = await hydrationInstance.simulateHydration();
    if (!process.env.PRIVATE_KEY) {
        console.error("Cannot Process Hydration Run Request - Private Key Of Executor Is Undefined");
        return false;
    }
    const executor = new Wallet(process.env.PRIVATE_KEY, network.provider);
    const diamondContract = new Contract(network.diamondAddress, DiamondABI, executor);
    const res = await (await diamondContract.hydrateAndExecuteRun.send(hydrationInstance.strategyAddress, hydrationInstance.operationIndex, hydratedCommands)).wait();
    return !!res;
};
offchainRequestsQueue.listen(hydrationRequestHandler);
//# sourceMappingURL=index.js.map