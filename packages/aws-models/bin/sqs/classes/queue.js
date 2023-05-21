/**
 * SQS Class to listen, emit to a specific queue
 * @generic T - The type of message body that can be emitted/listened to
 * @param queueURL - The queue URL to listen to
 * @param sqsProps - The SQS props to pass onto the SQS instance
 * @default useast1client - The default client used by @OfirYC on the YC AWS Account
 */
import dotenv from "dotenv";
dotenv.config();
import AWS from "aws-sdk";
export class SQSQueue {
    // ======================
    //         FIELDS
    // ======================
    queue;
    #instance;
    // ======================
    //      CONSTRUCTOR
    // ======================
    constructor(_queueUrl, _sqsProps = {
        region: "us-east-1",
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }) {
        this.#instance = new AWS.SQS(_sqsProps);
        this.queue = _queueUrl;
    }
    // ======================
    //        METHODS
    // ======================
    /**
     * Emit a message to our global queue
     * @param messageBody - the body of the message to send
     * @param msgGroupID - Required, the group ID it will show under
     */
    async emit(messageBody, msgGroupID) {
        const params = {
            MessageBody: JSON.stringify(messageBody),
            MessageGroupId: msgGroupID,
            QueueUrl: this.queue,
            DelaySeconds: 0,
        };
        await this.#instance.sendMessage(params).promise();
    }
    /**
     * Continuously listen for messages on the global queue, and invoke a handler function
     * @param handler - The handler to use when a new event is dequeued
     */
    async listen(handler) {
        // Log that we are currently listening
        console.log("Listening To The", this.queue.split("sqs.us-east-1.amazonaws.com/010073361729/")[1], "SQS Queue...");
        // Parameters for SQS listening
        const params = {
            QueueUrl: this.queue,
            VisibilityTimeout: 120,
            WaitTimeSeconds: 20,
        };
        // Wrap in try catch
        try {
            // Call receiveMessage() on the AWS SDK SQS class - Receive
            const { Messages } = await this.#instance
                .receiveMessage(params)
                .promise();
            // @notice
            // If we got no messages back, we immedaitly recurse (No need for further computation)
            if (!Messages || !Messages[0] || !Messages[0].MessageId)
                return this.listen(handler);
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
                    QueueUrl: this.queue,
                    ReceiptHandle: message.ReceiptHandle || "",
                };
                // Send the delete message call to SQS
                try {
                    await this.#instance.deleteMessage(deleteParams).promise();
                }
                catch (e) {
                    const { Messages: newMessages } = await this.#instance
                        .receiveMessage(params)
                        .promise();
                    if (!Messages)
                        throw "Cannot Delete Operation.";
                    for (const msg of newMessages || []) {
                        if (msg.MessageId == message.MessageId)
                            await this.#instance
                                .deleteMessage({
                                QueueUrl: this.queue,
                                ReceiptHandle: msg.ReceiptHandle || "",
                            })
                                .promise();
                    }
                }
                /**
                 * @notice
                 * Finally, we recruse the function call - We do not await it though to avoid too deep of a memory stack
                 */
                this.listen(handler);
            }
        }
        catch (e) {
            console.error("YC SQS ERR CAUGHT:", e);
        }
    }
}
//# sourceMappingURL=queue.js.map