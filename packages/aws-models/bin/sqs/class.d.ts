import AWS from "aws-sdk";
export declare class SQSQueue<T = any> {
    #private;
    readonly queue: string;
    constructor(_queueUrl: string, _sqsProps?: AWS.SQS.ClientConfiguration);
    /**
     * Emit a message to the queue specified
     * @param event
     * @param message
     * @param queueUrl
     */
    emit(messageBody: T, msgGroupID?: string): Promise<void>;
    /**
     * Continuously listen for messages on the queue specified, and invoke a handler function
     * @param queueUrl
     * @param handler
     */
    listen(handler: (msgbody: T) => Promise<any>): Promise<void>;
}
