import { isOnchainCached } from "./utils.js";
// Handle a caught offchain event
export const onchainEventHandler = async (event, Orchestrator) => {
    if (!(await isOnchainCached(event)))
        Orchestrator.emit("StartOffchainAction", event, "https://sqs.us-east-1.amazonaws.com/010073361729/Offchain-Actions.fifo");
    console.log("Event emitted from handler");
};
export const forkRequestHandler = async (event, Orchestrator) => {
    console.log("Inside Fork Request Handler");
    Orchestrator.emit("CreateFork", event, "https://sqs.us-east-1.amazonaws.com/010073361729/Create-Fork.fifo");
};
// TODO: Add an event emit to have onchain listener listen to the fork?
export const forkCreatedHandler = async (event, Orchestrator) => {
    console.log("Inside Fork Created Handler");
    Orchestrator.emit("ForkReady", event, "https://sqs.us-east-1.amazonaws.com/010073361729/Forks-Ready.fifo");
    //   Orchestrator.emit("ListenOnFork", event.Messages[0].Body.forkCreated);
};
export const forkDeleteHandler = async (event, Orchestrator) => {
    console.log("Inside Fork Delete Handler");
    Orchestrator.emit("KillFork", event, "https://sqs.us-east-1.amazonaws.com/010073361729/Kill-Forks.fifo");
};
// TODO: If end up adding the event listener to forks thing, add an event that emits every time a fork is deleted
//# sourceMappingURL=handlers.js.map