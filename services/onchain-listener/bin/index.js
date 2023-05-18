import dotenv from "dotenv";
dotenv.config();
import { BucketCacher, SQSQueue } from "@yc/aws-models";
import { HYDRATE_RUN_ONCHAIN_EVENT_SIGNATURE, YCClassifications, ONCHAIN_LOGS_QUEUE_URL, } from "@yc/yc-models";
import { OnchainListener } from "./classes/onchain-listener.js";
import { isRegisteredStrategy } from "./utils/is-registered-strategy.js";
// We first of all hydrate our context to get access to the networks supported
await YCClassifications.getInstance().initiallize();
// Our providers
const networks = YCClassifications.getInstance().networks.flatMap((network) => network.provider && network.diamondAddress ? [network] : []);
// The instance used to check whether an event is cached or not (to allow for multiple listeners)
const onchainLogsCacheBucket = new BucketCacher("onchain-logs", (log) => `${log.transactionHash}_${log.topics[1]}_${log.index}`, (log) => JSON.stringify({
    log: log,
}));
// SQS Queue instance
const onchainLogsSQSQueue = new SQSQueue(ONCHAIN_LOGS_QUEUE_URL);
// The handler of a new event caught by the listener
const newEventHandler = async (event, network) => {
    if (!(await isRegisteredStrategy(event.address, network))) {
        console.log("Not a YC strategy");
        return;
    }
    if (await onchainLogsCacheBucket.cached(event)) {
        console.log("Already Got This Event");
        return;
    }
    else {
        console.log("Non-cached event, caching...");
        onchainLogsCacheBucket.smartCache(event);
    }
    const sqsOnchainLog = {
        log: event,
        rpc_url: network.provider._getConnection().url,
    };
    onchainLogsSQSQueue.emit(sqsOnchainLog, "logs");
};
// The listener instance
const onchainListener = new OnchainListener(HYDRATE_RUN_ONCHAIN_EVENT_SIGNATURE, newEventHandler, networks, 20);
// We begin listening
await onchainListener.listenToAll();
//# sourceMappingURL=index.js.map