import { SQSOrchestrator } from "@yc/aws-models";
import { InboundOnchainEvent } from "./types.js";
import { OFFCHAIN_EXECUTION_REQUESTS_QUEUE_URL } from "@yc/yc-models";

// Handle a caught offchain event
export const onchainlogsEventHandler = async (
  event: InboundOnchainEvent
): Promise<boolean> => {
  try {
    console.log("Onchain Logs Handler Invoked. Event:", event);

    await SQSOrchestrator.getInstance().emit(
      OFFCHAIN_EXECUTION_REQUESTS_QUEUE_URL,
      event,
      "hydrate_and_execute_run"
    );
    return true;
  } catch (e: any) {
    console.error(
      "Caught Error Handling Onchain Log In Orchestrator. Error:",
      e
    );
    return false;
  }
};
