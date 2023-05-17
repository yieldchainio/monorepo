import dotenv from "dotenv";
dotenv.config();
import { Endpoints, YCClassifications } from "@yc/yc-models";
import { BucketCacher, SQSQueue } from "@yc/aws-models";
import { OnchainListener } from "./classes/onchain-listener.js";
import { HYDRATE_RUN_ONCHAIN_EVENT_HASH, ONCHAIN_LOGS_SQS_QUEUE_URL, } from "./constants.js";
import { isRegisteredStrategy } from "./utils/is-registered-strategy.js";
// We first of all hydrate our context to get access to the networks supported
await YCClassifications.getInstance().refresh(Endpoints.NETWORKS);
// Our providers
const networks = YCClassifications.getInstance().networks.flatMap((network) => network.provider && network.diamondAddress ? [network] : []);
// The instance used to check whether an event is cached or not (to allow for multiple listeners)
const onchainLogsCacheBucket = new BucketCacher("onchain_logs", (log) => `${log.transactionHash}_${log.topics[1]}_${log.index}`, (log) => JSON.parse(JSON.stringify({
    log: log,
})));
// SQS Queue instance
const onchainLogsSQSQueue = new SQSQueue(ONCHAIN_LOGS_SQS_QUEUE_URL);
// The handler of a new event caught by the listener
const newEventHandler = async (event, network) => {
    if (!(await isRegisteredStrategy(event.address, network)))
        return;
    if (await onchainLogsCacheBucket.cached(event))
        return;
    onchainLogsCacheBucket.smartCache(event);
    const sqsOnchainLog = {
        log: event,
        rpc_url: network.provider._getConnection().url,
    };
    onchainLogsSQSQueue.emit(sqsOnchainLog);
};
// The listener instance
const onchainListener = new OnchainListener(HYDRATE_RUN_ONCHAIN_EVENT_HASH, newEventHandler, networks, 20);
// We begin listening
await onchainListener.listenToAll();
//# sourceMappingURL=index.js.map