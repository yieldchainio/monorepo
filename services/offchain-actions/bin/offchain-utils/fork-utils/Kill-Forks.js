import AWS from "aws-sdk";
const KillForks = async (forksArr) => {
    let forksKillPromises = forksArr.map(async (fork) => {
        const params = {
            MessageBody: JSON.stringify({ forkId: fork }),
            QueueUrl: "https://sqs.us-east-1.amazonaws.com/010073361729/Kill-Forks.fifo",
        };
        const sqs = new AWS.SQS({
            region: "us-east-1",
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
        const { MessageId } = await sqs.sendMessage(params).promise();
        return MessageId;
    });
    const forksKillMessages = await Promise.all(forksKillPromises);
    return forksKillMessages || null;
};
export default KillForks;
//# sourceMappingURL=Kill-Forks.js.map