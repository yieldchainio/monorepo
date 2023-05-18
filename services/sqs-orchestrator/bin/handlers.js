import { SQSOrchestrator } from "@yc/aws-models";
import { OFFCHAIN_EXECUTION_REQUESTS_QUEUE_URL } from "@yc/yc-models";
// Handle a caught offchain event
export const onchainlogsEventHandler = async (event) => {
    try {
        console.log("Onchain Logs Handler Invoked. Event:", event);
        await SQSOrchestrator.getInstance().emit(OFFCHAIN_EXECUTION_REQUESTS_QUEUE_URL, event, "hydrate_and_execute_run");
        return true;
    }
    catch (e) {
        console.error("Caught Error Handling Onchain Log In Orchestrator. Error:", e);
        return false;
    }
};
//# sourceMappingURL=handlers.js.map