import dotenv from "dotenv";
dotenv.config();
import AWS from "aws-sdk";
import { Message, SendMessageRequest } from "aws-sdk/clients/sqs";

export class SQSQueue<T = any> {
  // ======================
  //         FIELDS
  // ======================
  public readonly queue: string;

  #instance: AWS.SQS;

  // ======================
  //      CONSTRUCTOR
  // ======================
  constructor(
    _queueUrl: string,
    _sqsProps: AWS.SQS.ClientConfiguration = {
      region: "us-east-1",
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  ) {
    this.#instance = new AWS.SQS(_sqsProps);
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
  async emit(messageBody: T, msgGroupID: string) {
    const params: SendMessageRequest = {
      MessageBody: JSON.stringify(messageBody),
      MessageGroupId: msgGroupID,
      QueueUrl: this.queue,
      DelaySeconds: 0,
    };

    await this.#instance.sendMessage(params).promise();
  }

  /**
   * Continuously listen for messages on the queue specified, and invoke a handler function
   * @param queueUrl
   * @param handler
   */
  async listen(handler: (msgbody: T) => Promise<any>): Promise<void> {
    // Log that we are currently listening
    console.log(
      "Listening To The",
      this.queue.split("sqs.us-east-1.amazonaws.com/010073361729/")[1],
      "SQS Queue..."
    );
    // Parameters for SQS listening
    const params = {
      QueueUrl: this.queue,
      VisibilityTimeout: 120,
      WaitTimeSeconds: 20,
    };

    // Wrap in try catch
    try {
      // Call receiveMessage() on the AWS SDK SQS class - Receive
      const { Messages } = await this.#instance.receiveMessage(params).promise();

      // @notice
      // If we got no messages back, we immedaitly recurse (No need for further computation)
      if (!Messages || !Messages[0] || !Messages[0].MessageId)
        return this.listen(handler);

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

        const handlerRes = await handler(JSON.parse(message.Body));

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

        /**
         * Delete the message from the SQS queue after we are done processing (or not processing if its cached as processed)
         */

        // Delete parameters
        const deleteParams = {
          QueueUrl: this.queue,
          ReceiptHandle: message.ReceiptHandle || "",
        };

        // Send the delete message call to SQS
        await this.#instance.deleteMessage(deleteParams).promise();

        /**
         * @notice
         * Finally, we recruse the function call - We do not await it though to avoid too deep of a memory stack
         */
        this.listen(handler);
      }
    } catch (e: any) {
      console.error("YC SQS ERR CAUGHT:", e);
    }
  }
}
