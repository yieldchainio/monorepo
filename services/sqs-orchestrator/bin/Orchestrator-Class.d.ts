import AWS from "aws-sdk";
export default class SQSOrchestrator {
    private readonly sqs;
    constructor(sqs: AWS.SQS);
    /**
     * Emit a message to the queue specified
     * @param event
     * @param message
     * @param queueUrl
     */
    emit(event: string, message: string, queueUrl: string): Promise<void>;
    /**
     * Continuously listen for messages on the queue specified, and invoke a handler function
     * @param queueUrl
     * @param handler
     */
    listen(queueUrl: string, handler: Function): Promise<void>;
}
