import dotenv from "dotenv";
dotenv.config();
import { Log } from "ethers";
import { BucketCacher, SQSQueue } from "@yc/aws-models";
import {
  SQSOnchainLog,
  SupportedYCNetwork,
  HYDRATE_RUN_ONCHAIN_EVENT_SIGNATURE,
  YCClassifications,
  address,
  ONCHAIN_LOGS_QUEUE_URL,
} from "@yc/yc-models";
import { OnchainListener } from "./classes/onchain-listener.js";

import { isRegisteredStrategy } from "./utils/is-registered-strategy.js";

// We first of all hydrate our context to get access to the networks supported
await YCClassifications.getInstance().initiallize();

// Our providers
const networks: SupportedYCNetwork[] =
  YCClassifications.getInstance().networks.flatMap((network) =>
    network.provider && network.diamondAddress ? [network] : []
  ) as SupportedYCNetwork[];

// The instance used to check whether an event is cached or not (to allow for multiple listeners)
const onchainLogsCacheBucket = new BucketCacher<Log>(
  "onchain-logs",
  (log: Log) => `${log.transactionHash}_${log.topics[1]}_${log.index}`,
  (log: Log) =>
    JSON.stringify({
      log: log,
    })
);

// SQS Queue instance
const onchainLogsSQSQueue = new SQSQueue<SQSOnchainLog>(
  ONCHAIN_LOGS_QUEUE_URL
);

// The handler of a new event caught by the listener
const newEventHandler = async (event: Log, network: SupportedYCNetwork) => {
  if (!(await isRegisteredStrategy(event.address as address, network))) {
    console.log("Not a YC strategy");
    return;
  }

  if (await onchainLogsCacheBucket.cached(event)) {
    console.log("Already Got This Event");
    return;
  } else {
    console.log("Non-cached event, caching...");
    onchainLogsCacheBucket.smartCache(event);
  }

  const sqsOnchainLog: SQSOnchainLog = {
    log: event,
    rpc_url: network.provider._getConnection().url,
  };

  onchainLogsSQSQueue.emit(sqsOnchainLog, "logs");
};

// The listener instance
const onchainListener = new OnchainListener(
  HYDRATE_RUN_ONCHAIN_EVENT_SIGNATURE,
  newEventHandler,
  networks,
  20
);

// We begin listening
await onchainListener.listenToAll();
