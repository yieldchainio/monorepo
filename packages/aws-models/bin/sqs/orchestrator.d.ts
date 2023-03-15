import AWS from "aws-sdk";
export default class GenericOrchestrator extends AWS.SQS {
    readonly queue: string;
    constructor(_queueUrl: string, _sqsProps?: AWS.SQS.ClientConfiguration);
    /**
     * Emit a message to the queue specified
     * @param event
     * @param message
     * @param queueUrl
     */
    emit(event: string, message: any, queueUrl: string): Promise<void>;
    /**
     * Continuously listen for messages on the queue specified, and invoke a handler function
     * @param queueUrl
     * @param handler
     */
    listen(handler: (msgbody: string) => Promise<any>): Promise<void>;
}
