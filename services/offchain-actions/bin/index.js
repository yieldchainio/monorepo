import pkg from "aws-sdk";
const { SQS } = pkg;
import { handleCallbackEvent } from "./handle-callback-event.js";
import GenericOrchestrator from "./sqs-class.js";
import dotenv from "dotenv";
dotenv.config();
try {
    const sqs = new SQS({
        region: "us-east-1",
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    let SQSAbstracted = GenericOrchestrator.getSingleton(sqs);
    const OffchainActionsQueueUrl = "https://sqs.us-east-1.amazonaws.com/010073361729/Offchain-Actions.fifo";
    // Listening of the offchain actions queue, handling callback events received
    SQSAbstracted.listen(OffchainActionsQueueUrl, async (message) => {
        try {
            return await handleCallbackEvent(message);
        }
        catch (error) {
            console.error("Error in the .listen in SQS-Listener", error.message);
            throw "Hehe";
        }
    });
}
catch (e) {
    console.log(e.message);
    throw "Debug";
}
//# sourceMappingURL=index.js.map