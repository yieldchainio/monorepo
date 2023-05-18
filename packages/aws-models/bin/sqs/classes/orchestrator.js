/**
 * SQS Class to listen, emit to multiple queues ("Orchestration")
 * @generic T - The type of message body that can be emitted/listened to
 * @param sqsProps - The SQS props to pass onto the SQS instance
 * @default useast1client - The default client used by @OfirYC on the YC AWS Account
 */
import dotenv from "dotenv";
dotenv.config();
import AWS from "aws-sdk";
export class SQSOrchestrator {
    // ======================
    //         FIELDS
    // ======================
    #sqsInstance;
    static #singletonInstance;
    static getInstance() {
        if (!SQSOrchestrator.#singletonInstance)
            SQSOrchestrator.#singletonInstance = new SQSOrchestrator();
        return SQSOrchestrator.#singletonInstance;
    }
    // ======================
    //      CONSTRUCTOR
    // ======================
    constructor(_sqsProps = {
        region: "us-east-1",
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }) {
        this.#sqsInstance = new AWS.SQS(_sqsProps);
    }
    // ======================
    //        METHODS
    // ======================
    /**
     * Emit a message to the queue specified
     * @param queueURL - The queue URL to emit to
     * @param messageBody - the body of the message to send
     * @param msgGroupID - Required, the group ID it will show under
     */
    async emit(queueURL, messageBody, msgGroupID) {
        const params = {
            MessageBody: JSON.stringify(messageBody),
            MessageGroupId: msgGroupID,
            QueueUrl: queueURL,
            DelaySeconds: 0,
        };
        await this.#sqsInstance.sendMessage(params).promise();
    }
    /**
     * Continuously listen for messages on the queue specified, and invoke a handler function
     * @param queueUrl - The URL of the queue to listen to
     * @param handler - The handler to use when a new event is dequeued
     */
    async listen(queueURL, handler) {
        // Log that we are currently listening
        console.log("Listening To The", queueURL.split("sqs.us-east-1.amazonaws.com/010073361729/")[1], "SQS Queue...");
        // Parameters for SQS listening
        const params = {
            QueueUrl: queueURL,
            VisibilityTimeout: 120,
            WaitTimeSeconds: 20,
        };
        // Wrap in try catch
        try {
            // Call receiveMessage() on the AWS SDK SQS class - Receive
            const { Messages } = await this.#sqsInstance
                .receiveMessage(params)
                .promise();
            // @notice
            // If we got no messages back, we immedaitly recurse (No need for further computation)
            if (!Messages || !Messages[0] || !Messages[0].MessageId)
                return this.listen(queueURL, handler);
            // Log that we successfully got valid messages
            console.log(`YC SQS Listener Received Valid Messages: ${Messages.map((msg) => msg.MessageId)}`);
            // If we did get a message, we process it.
            for (const message of Messages) {
                // Handle potential empty messages (Not processable)
                if (!message.Body)
                    continue;
                const handlerRes = await handler(JSON.parse(message.Body));
                // Log result of the processing
                if (handlerRes)
                    console.log("YC SQS Listener Succesfully Proccessed Message :) ID:", message.MessageId);
                else
                    console.log("YC SQS Listener Failed To Process Message :( ID:", message.MessageId, "Value:", handlerRes);
                /**
                 * Delete the message from the SQS queue after we are done processing (or not processing if its cached as processed)
                 */
                // Delete parameters
                const deleteParams = {
                    QueueUrl: queueURL,
                    ReceiptHandle: message.ReceiptHandle || "",
                };
                // Send the delete message call to SQS
                await this.#sqsInstance.deleteMessage(deleteParams).promise();
                /**
                 * @notice
                 * Finally, we recruse the function call - We do not await it though to avoid too deep of a memory stack
                 */
                this.listen(queueURL, handler);
            }
        }
        catch (e) {
            console.error("YC SQS ERR CAUGHT:", e);
        }
    }
}
//# sourceMappingURL=orchestrator.js.map