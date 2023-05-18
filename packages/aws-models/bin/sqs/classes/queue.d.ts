import AWS from "aws-sdk";
export declare class SQSQueue<T = any> {
    #private;
    readonly queue: string;
    constructor(_queueUrl: string, _sqsProps?: AWS.SQS.ClientConfiguration);
    /**
     * Emit a message to our global queue
     * @param messageBody - the body of the message to send
     * @param msgGroupID - Required, the group ID it will show under
     */
    emit(messageBody: T, msgGroupID: string): Promise<void>;
    /**
     * Continuously listen for messages on the global queue, and invoke a handler function
     * @param handler - The handler to use when a new event is dequeued
     */
    listen(handler: (msgbody: T) => Promise<any>): Promise<void>;
}
