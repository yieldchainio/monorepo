import dotenv from "dotenv";
dotenv.config();
import AWS from "aws-sdk";
export default class GenericOrchestrator extends AWS.SQS {
    // ======================
    //         FIELDS
    // ======================
    queue;
    // ======================
    //      CONSTRUCTOR
    // ======================
    constructor(_queueUrl, _sqsProps = {
        region: "us-east-1",
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }) {
        // Super to the SQS class
        super(_sqsProps);
        // Set our queue
        this.queue = _queueUrl;
    }
    // ======================
    //        METHODS
    // ======================
    /**
     * Emit a message to the queue specified
     * @param event
     * @param message
     * @param queueUrl
     */
    async emit(event, message, queueUrl) {
        const params = {
            MessageBody: JSON.stringify({ event, message }),
            QueueUrl: queueUrl,
            DelaySeconds: 0,
        };
        await this.sendMessage(params).promise();
    }
    /**
     * Continuously listen for messages on the queue specified, and invoke a handler function
     * @param queueUrl
     * @param handler
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
            const { Messages } = await this.receiveMessage(params).promise();
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
                const handlerRes = await handler(message.Body);
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
                await this.deleteMessage(deleteParams).promise();
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
//# sourceMappingURL=orchestrator.js.map