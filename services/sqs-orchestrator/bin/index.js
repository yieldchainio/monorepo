import { SQSOrchestrator } from "@yc/aws-models";
import { onchainlogsEventHandler } from "./handlers.js";
import dotenv from "dotenv";
import { ONCHAIN_LOGS_QUEUE_URL, } from "./constants.js";
dotenv.config();
const orchestrator = SQSOrchestrator.getInstance();
// Listen for on-chain events
orchestrator.listen(ONCHAIN_LOGS_QUEUE_URL, onchainlogsEventHandler);
console.log("Orchestrator is listening for events...");
//# sourceMappingURL=index.js.map