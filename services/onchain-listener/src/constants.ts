/**
 * Constants for the onchain listener
 */

import { ethers } from "ethers";

// The hash of the HydrateRun event
export const HYDRATE_RUN_ONCHAIN_EVENT_HASH = ethers.id("HydrateRun(uint256)");

// The URL of the SQS queue to input onchain logs into
export const ONCHAIN_LOGS_SQS_QUEUE_URL =
  "https://sqs.us-east-1.amazonaws.com/010073361729/onchain-logs.fifo";
