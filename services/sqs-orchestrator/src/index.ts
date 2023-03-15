import SQSOrchestrator from "./Orchestrator-Class.js";
import AWS from "aws-sdk";
import {
  onchainEventHandler,
  forkRequestHandler,
  forkCreatedHandler,
  forkDeleteHandler,
} from "./handlers.js";
import dotenv from "dotenv";
dotenv.config();

const sqs: AWS.SQS = new AWS.SQS({
  region: "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const orchestrator: SQSOrchestrator = new SQSOrchestrator(sqs);

// Listen for on-chain events
orchestrator.listen(
  "https://sqs.us-east-1.amazonaws.com/010073361729/Onchain_Logs.fifo",
  onchainEventHandler
);

// Listen for fork request events
orchestrator.listen(
  "https://sqs.us-east-1.amazonaws.com/010073361729/Fork-Requests.fifo",
  forkRequestHandler
);

// Listen for fork created events (Emitted by forkchestrator when a fork is created)
orchestrator.listen(
  "https://sqs.us-east-1.amazonaws.com/010073361729/Forks-Pipeout.fifo",
  forkCreatedHandler
);

// Listen for fork deletion events (Emitted by an Offchain action when a fork is no longer needed)
orchestrator.listen(
  "https://sqs.us-east-1.amazonaws.com/010073361729/Delete-Fork-Requests.fifo",
  forkDeleteHandler
);

console.log("Orchestrator is listening for events...");
