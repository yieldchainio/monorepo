import AWS from "aws-sdk";
import { SQSOnchainLog } from "./offchain-types";
import { Message } from "aws-sdk/clients/sqs";
import dotenv from "dotenv";
dotenv.config();

export default class GenericOrchestrator {
  private static instance: GenericOrchestrator;
  private readonly sqs: AWS.SQS;
  constructor(_sqs?: AWS.SQS) {
    if (_sqs) this.sqs = _sqs;
    else
      this.sqs = new AWS.SQS({
        region: "us-east-1",
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });
  }

  public static getSingleton(sqs?: AWS.SQS) {
    if (!GenericOrchestrator.instance && sqs) {
      GenericOrchestrator.instance = new GenericOrchestrator(sqs);
    }
    return GenericOrchestrator.instance;
  }

  /**
   * Emit a message to the queue specified
   * @param event
   * @param message
   * @param queueUrl
   */
  async emit(event: string, message: any, queueUrl: string) {
    const params = {
      MessageBody: JSON.stringify({ event, message }),
      QueueUrl: queueUrl,
      DelaySeconds: 0,
    };

    await this.sqs.sendMessage(params).promise();
  }

  /**
   * @notice
   * An array of TXIDs to ignore. This is used by some offchain actions that want to handle the callbacks themselves, and avoid
   * double processing.
   */
  private txidsToIgnore: string[] = [];
  private processedTxns: string[] = [];

  public addTxnToIgnore(txid: string) {
    this.txidsToIgnore.push(txid);
  }

  public getTxidsToIgnore() {
    return this.txidsToIgnore;
  }

  // Function process TXNs
  shouldTxnBeIgnored(_log: string | object) {
    // Check if message is a log - ignore it if it is not.
    let log: SQSOnchainLog | false = this.getOnchainLog(_log);
    if (!log) return false;

    // If the TXID is in the ignore list, then ignore it
    if (this.txidsToIgnore.includes(log.transactionHash)) return true;
    else {
      this.addTxnToIgnore(log.transactionHash); // Add the TXID to the ignore list, so that it does not process twice
      return false;
    }
  }

  /**
   * Checks is a message is an Onchain logs, returns a parsed version of it if it is, false otherwise.
   */
  getOnchainLog(body: string | object): SQSOnchainLog | false {
    const onChainLog = typeof body == "string" ? JSON.parse(body) : body;
    if (onChainLog?.transactionHash) return onChainLog;
    else return false;
  }

  /**
   * Continuously listen for messages on the queue specified, and invoke a handler function
   * @param queueUrl
   * @param handler
   */
  async listen(queueUrl: string, handler: Function): Promise<void> {
    console.log(
      "Listening To The",
      queueUrl.split("sqs.us-east-1.amazonaws.com/010073361729/")[1],
      "SQS Queue..."
    );
    // Parameters for SQS listening
    const params = {
      QueueUrl: queueUrl,
      VisibilityTimeout: 120,
      WaitTimeSeconds: 20,
    };

    try {
      // Call receiveMessage() on the AWS SDK SQS class - Receive
      const { Messages } = await this.sqs.receiveMessage(params).promise();

      // @notice
      // If we got no messages back, we immedaitly recurse (No need for further computation)
      if (!Messages || !Messages[0] || !Messages[0].MessageId)
        return this.listen(queueUrl, handler);

      // Log that we successfully got valid messages
      console.log(
        `YC SQS Listener Received Valid Messages: ${Messages.map(
          (msg: Message) => msg.MessageId
        )}`
      );

      // If we did get a message, we process it.
      for (const message of Messages) {
        // Handle potential empty messages (Not processable)
        if (!message.Body) continue;

        /**
         * @notice
         * @uses shouldTxnBeIgnored() in order to check the message's body, and see if it is:
         * 1) A TXN at all
         * 2) A TXN that should be ignored (Already proceessed!)
         * if it shouldnt be ignored (Not yet processed), we call the action handler with the message's body.
         * In addition to that, we @cache it as a proccessed txn after it is done processing
         *
         * If the handler returns a falsy value, we do not cache it as processed (as it did not succeed) - We do delete it from the SQS queue, though.
         */
        if (!this.shouldTxnBeIgnored(message.Body)) {
          // The result the handler returns
          console.log(
            "About To call handler in .listen",
            Math.floor(Date.now() / 1000)
          );
          const handlerRes = await handler(message.Body);

          // Log result of the processing
          if (handlerRes)
            console.log(
              "YC SQS Listener Succesfully Proccessed Message :) ID:",
              message.MessageId
            );
          else
            console.log(
              "YC SQS Listener Failed To Process Message :( ID:",
              message.MessageId,
              "Value:",
              handlerRes
            );

          // Parsing the onchain txn
          const onchainTxn = this.getOnchainLog(message.Body);

          // Add it as processed
          // @only if the handler went through
          if (onchainTxn && handlerRes) {
            this.processedTxns.push(onchainTxn.transactionHash);
          }
        }

        /**
         * Delete the message from the SQS queue after we are done processing (or not processing if its cached as processed)
         */

        // Delete parameters
        const deleteParams = {
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle || "",
        };

        // Send the delete message call to SQS
        await this.sqs.deleteMessage(deleteParams).promise();

        /**
         * @notice
         * Finally, we recruse the function call - We do not await it though to avoid too deep of a memory stack
         */
        this.listen(queueUrl, handler);
      }
    } catch (e: any) {
      console.error("YC SQS ERR CAUGHT:", e);
    }
  }

  /**
   * @notice
   * A function that runs in the background, and removes old txids from the ignore list.
   */
  collectGarbage = async () => {
    await new Promise((resolve) => {
      this.txidsToIgnore = this.txidsToIgnore.filter(
        (txn: string) => !this.processedTxns.includes(txn)
      );
      this.processedTxns = [];
      setTimeout(resolve, 60000);
    });
    this.collectGarbage();
  };
}
