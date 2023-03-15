import { ForkResponse } from "./fork-types.js";
import findAvailablePort from "./findAvailablePort.js";
import ganache from "ganache";
interface ganacheOptions {
  chain: {
    chainId: number;
  };
  fork: {
    url: string;
    blockNumber: number;
  };
}

const createFork = async (
  ganacheOptions: ganacheOptions
): Promise<ForkResponse> => {
  // const sqs: AWS.SQS = new AWS.SQS({
  //   region: "us-east-1",
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // });

  // let forkRequestID = uuidv4();
  // let AWSRes = sqs.sendMessage(
  //   {
  //     MessageGroupId: "Create-Fork",
  //     QueueUrl:
  //       "https://sqs.us-east-1.amazonaws.com/010073361729/Fork-Requests.fifo",
  //     MessageBody: JSON.stringify({
  //       createFork: ganacheOptions,
  //       requester_id: forkRequestID,
  //     }),
  //   },
  //   (err: any, data: any) => {
  //     if (err) {
  //       console.log("Err submitting a fork request", err.message);
  //     } else {
  //       return data.MessageId;
  //     }
  //   }
  // );

  // let fork: {
  //   fork_status: boolean;
  //   json_rpc_url: string;
  //   requester_id: string;
  //   fork_id: string;
  // } = await new Promise((resolve: any, reject: any) => {
  //   let intervalId = setInterval(() => {
  //     sqs.receiveMessage(
  //       {
  //         QueueUrl:
  //           "https://sqs.us-east-1.amazonaws.com/010073361729/Forks-Ready.fifo",
  //         MaxNumberOfMessages: 1,
  //         WaitTimeSeconds: 5,
  //       },
  //       (err: any, data: AWS.SQS.Types.ReceiveMessageResult) => {
  //         if (err) {
  //           console.log(err);
  //         } else {
  //           // error @Typeguard
  //           if (data.Messages) {
  //             console.log("Messages ser!", data.Messages);

  //             // error @Typeguard
  //             if (data.Messages[0].Body === undefined)
  //               throw new Error("Body is undefined");

  //             // Body of the returned fork
  //             let body = JSON.parse(data.Messages[0].Body);
  //             console.log("Json parsed Body", body);

  //             // Checking if fork was successfully created, and if the requester id matches the one we sent
  //             if (
  //               body.fork_status === true &&
  //               body.requester_id == forkRequestID
  //             ) {
  //               // Clearing the interval, no need to loop anymore
  //               clearInterval(intervalId);

  //               // Deleting the message from the queue
  //               sqs
  //                 .deleteMessage({
  //                   QueueUrl:
  //                     "https://sqs.us-east-1.amazonaws.com/010073361729/Forks-Ready.fifo",
  //                   ReceiptHandle: data.Messages[0].ReceiptHandle || "",
  //                 })
  //                 .promise()
  //                 .then((data: any) =>
  //                   console.log("Deleted Message In Offchain Create Fork")
  //                 );
  //               resolve(body);
  //             } else {
  //               console.log("Fork not ready yet, body not matching");
  //               console.log(
  //                 "body requester id: ",
  //                 body.requester_id,
  //                 "Our ID: ",
  //                 forkRequestID
  //               );
  //             }
  //           }
  //         }
  //       }
  //     );
  //   }, 5000); // check for new messages every 5 seconds
  // });

  // if (
  //   fork.fork_status == false ||
  //   fork.json_rpc_url === null ||
  //   fork.fork_id === null ||
  //   fork.requester_id === null
  // ) {
  //   console.log("Fork", fork);
  //   throw new Error("Fork request failed");
  // } else {
  //   console.log("Returing fork", fork);
  //   return fork;
  // }
  let availablePort = await findAvailablePort(3003);

  console.log("Ganache Fork Port", availablePort);

  // let server = ganache.server({
  //   ...ganacheOptions,
  //   logging: {
  //     logger: {
  //       // dont wanna see all that shit
  //       log: (msg: any) => {},
  //     },
  //   },
  // });
  // server.listen(8545, async (e: any) => {
  //   if (e) {
  //     console.log("Error starting ganache server", e);
  //   } else {
  //     console.log("Ganache server started");
  //   }
  // });

  return {
    fork_status: true,
    json_rpc_url: `http://localhost:8545/`,
    requester_id: "123",
    fork_id: "123",
  };
};
export default createFork;
