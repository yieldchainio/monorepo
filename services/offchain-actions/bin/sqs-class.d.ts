import AWS from "aws-sdk";
import { SQSOnchainLog } from "./offchain-types";
export default class GenericOrchestrator {
    private static instance;
    private readonly sqs;
    constructor(_sqs?: AWS.SQS);
    static getSingleton(sqs?: AWS.SQS): GenericOrchestrator;
    /**
     * Emit a message to the queue specified
     * @param event
     * @param message
     * @param queueUrl
     */
    emit(event: string, message: any, queueUrl: string): Promise<void>;
    /**
     * @notice
     * An array of TXIDs to ignore. This is used by some offchain actions that want to handle the callbacks themselves, and avoid
     * double processing.
     */
    private txidsToIgnore;
    private processedTxns;
    addTxnToIgnore(txid: string): void;
    getTxidsToIgnore(): string[];
    shouldTxnBeIgnored(_log: string | object): boolean;
    /**
     * Checks is a message is an Onchain logs, returns a parsed version of it if it is, false otherwise.
     */
    getOnchainLog(body: string | object): SQSOnchainLog | false;
    /**
     * Continuously listen for messages on the queue specified, and invoke a handler function
     * @param queueUrl
     * @param handler
     */
    listen(queueUrl: string, handler: Function): Promise<void>;
    /**
     * @notice
     * A function that runs in the background, and removes old txids from the ignore list.
     */
    collectGarbage: () => Promise<void>;
}
