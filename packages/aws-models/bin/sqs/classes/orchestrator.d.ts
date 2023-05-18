import AWS from "aws-sdk";
export declare class SQSOrchestrator {
    #private;
    static getInstance(): SQSOrchestrator;
    constructor(_sqsProps?: AWS.SQS.ClientConfiguration);
    /**
     * Emit a message to the queue specified
     * @param queueURL - The queue URL to emit to
     * @param messageBody - the body of the message to send
     * @param msgGroupID - Required, the group ID it will show under
     */
    emit<T>(queueURL: string, messageBody: T, msgGroupID: string): Promise<void>;
    /**
     * Continuously listen for messages on the queue specified, and invoke a handler function
     * @param queueUrl - The URL of the queue to listen to
     * @param handler - The handler to use when a new event is dequeued
     */
    listen<T>(queueURL: string, handler: (msgbody: T) => Promise<any>): Promise<void>;
}
