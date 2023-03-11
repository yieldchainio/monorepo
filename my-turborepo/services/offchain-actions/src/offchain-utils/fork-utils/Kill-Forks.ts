import AWS from "aws-sdk";

const KillForks = async (forksArr: string[]) => {
  let forksKillPromises = forksArr.map(async (fork: string) => {
    const params = {
      MessageBody: JSON.stringify({ forkId: fork }),
      QueueUrl:
        "https://sqs.us-east-1.amazonaws.com/010073361729/Kill-Forks.fifo",
    };
    const sqs: AWS.SQS = new AWS.SQS({
      region: "us-east-1",
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    const { MessageId } = await sqs.sendMessage(params).promise();
    return MessageId as string;
  });

  const forksKillMessages: string[] = await Promise.all(forksKillPromises);
  return forksKillMessages || null;
};

export default KillForks;
