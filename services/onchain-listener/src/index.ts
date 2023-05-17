import dotenv from "dotenv";
dotenv.config();
import { Contract, Log } from "ethers";
import { Endpoints, YCClassifications, address } from "@yc/yc-models";
import { BucketCacher, SQSQueue } from "@yc/aws-models";
import factoryABI from "@yc/yc-models/src/ABIs/factory.json" assert { type: "json" };
import { SQSOnchainLog, SupportedYCNetwork } from "./types";
import { OnchainListener } from "./classes/onchain-listener.js";
import {
  HYDRATE_RUN_ONCHAIN_EVENT_HASH,
  ONCHAIN_LOGS_SQS_QUEUE_URL,
} from "./constants.js";
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
  "onchain_logs",
  (log: Log) => `${log.transactionHash}_${log.topics[1]}_${log.index}`,
  (log: Log) =>
    JSON.parse(
      JSON.stringify({
        log: log,
      })
    )
);

// SQS Queue instance
const onchainLogsSQSQueue = new SQSQueue<SQSOnchainLog>(
  ONCHAIN_LOGS_SQS_QUEUE_URL
);

// The handler of a new event caught by the listener
const newEventHandler = async (event: Log, network: SupportedYCNetwork) => {
  if (!(await isRegisteredStrategy(event.address as address, network))) return;

  if (await onchainLogsCacheBucket.cached(event)) return;
  onchainLogsCacheBucket.smartCache(event);

  const sqsOnchainLog: SQSOnchainLog = {
    log: event,
    rpc_url: network.provider._getConnection().url,
  };

  onchainLogsSQSQueue.emit(sqsOnchainLog);
};

// The listener instance
const onchainListener = new OnchainListener(
  HYDRATE_RUN_ONCHAIN_EVENT_HASH,
  newEventHandler,
  networks,
  20
);

// We begin listening
await onchainListener.listenToAll();
