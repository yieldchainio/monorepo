import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

export default class SQSOrchestrator {
  constructor(private readonly sqs: AWS.SQS) {}

  /**
   * Emit a message to the queue specified
   * @param event
   * @param message
   * @param queueUrl
   */
  async emit(event: string, message: string, queueUrl: string) {
    const params = {
      MessageBody: message,
      QueueUrl: queueUrl,
      DelaySeconds: 0,
      MessageGroupId: event,
    };

    await this.sqs
      .sendMessage(params, (err: any, data: any) => {
        if (err) {
          console.log("Error In Emit (Send Message)", err.message);
        } else if (data) {
          console.log("Success In Emit", data.MessageId);
        }
      })
      .promise();
  }

  /**
   * Continuously listen for messages on the queue specified, and invoke a handler function
   * @param queueUrl
   * @param handler
   */
  async listen(queueUrl: string, handler: Function) {
    while (true) {
      const params = {
        QueueUrl: queueUrl,
        VisibilityTimeout: 120,
        WaitTimeSeconds: 20,
      };

      let Messages;

      try {
        ({ Messages } = await this.sqs.receiveMessage(params).promise());
        console.log("Success listening for message");
      } catch (e: any) {
        console.error("Error while listening for message", e.message);
      }

      if (Messages) {
        for (const message of Messages) {
          await handler(message.Body, this);

          const deleteParams = {
            QueueUrl: queueUrl,
            ReceiptHandle: message.ReceiptHandle || "",
          };

          console.log("Deleting message", deleteParams);
          await this.sqs
            .deleteMessage(deleteParams, (err: any, data: any) => {
              if (err) {
                console.log("Error In Delete serra", err);
              } else if (data) {
                console.log("Success In Delete Serra", data);
              }
            })
            .promise();
        }
      }
    }
  }
}
