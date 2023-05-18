import { SQSOrchestrator } from "@yc/aws-models";
import { onchainlogsEventHandler } from "./handlers.js";
import dotenv from "dotenv";
import { ONCHAIN_LOGS_QUEUE_URL } from "@yc/yc-models";
dotenv.config();

const orchestrator: SQSOrchestrator = SQSOrchestrator.getInstance();

// Listen for on-chain events
orchestrator.listen(ONCHAIN_LOGS_QUEUE_URL, onchainlogsEventHandler);

console.log("Orchestrator is listening for events...");
