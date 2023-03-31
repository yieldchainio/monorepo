import { ethers } from "ethers";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pkg from "aws-sdk";
import axios from "axios";
const { SQS } = pkg;
dotenv.config();
/**
 ************** @Express app************************* */
const app = express();
let sqs = new SQS({
    region: "us-east-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
const PORT = 3100;
/**************************************************** */
/**
 * @EventQueue
 * The main event listener class
 * It listens to the blockchain and enqueues the events
 * It also handles the events
 * It can be used to listen to multiple blockchains
 * @providers - an array of providers
 * @listenedProviders - a set of providers that are already listened to
 * @eventQueue - an array of events (The queue)
 * @addProvider - adds a provider to the providers array
 * @enqueue - adds an event to the event queue
 * @dequeue - removes an event from the event queue
 * @handleEvent - handles an event
 * @startHandling - starts handling events
 * @listen - listens to the providers
 * @stopListening - stops listening to the providers
 * @restartListeners - restarts the listeners
 */
class EventQueue {
    // The providers to listen to
    providers = [];
    // The providers that are already listened to
    listenedProviders = new Set();
    // The event queue
    eventQueue = [];
    // Whether we are currently listening or not
    listening = false;
    // Add initial provider(s) to listen to when running the app
    constructor() {
        this.addProvider("https://bsc-dataseed.binance.org/");
        this.addProvider("https://rpc.ankr.com/arbitrum");
        this.listen();
    }
    // Add a provider to listen to (JSON RPC), restart listening
    addProvider(url) {
        const provider = new ethers.JsonRpcProvider(url);
        this.providers.push(provider);
    }
    // Enqueue an event
    enqueue(event) {
        this.eventQueue.push(event);
    }
    // Dequeue an event
    dequeue() {
        return this.eventQueue.shift();
    }
    // Handle Events' Queue,
    //  - Dequeue an event
    //  - Emit the event to the Onchain_Logs.fifo @SQS queue
    //  - Log the event
    async handleEvent() {
        while (this.eventQueue.length > 0) {
            const event = this.dequeue();
            if (event) {
                /**
                 * @notice
                 * Emitting an event to the Onchain_Logs.fifo @SQS queue.
                 */
                const params = {
                    MessageBody: JSON.stringify(event),
                    MessageGroupId: "Onchain-Logs",
                    QueueUrl: "https://sqs.us-east-1.amazonaws.com/010073361729/Onchain_Logs.fifo",
                };
                sqs.sendMessage(params, (err, data) => {
                    if (err) {
                        console.log("Error In Event Listener Handler", err);
                    }
                    else {
                        console.log("Success", data.MessageId);
                    }
                });
                console.log("Caught Onchain Event event, ", event);
            }
        }
    }
    // Start handling events
    // - Handle events every 200ms
    async startHandling() {
        setInterval(() => {
            this.handleEvent();
        }, 200);
    }
    /**
     * @notice
     * Listen to the providers
     * - Listen to the providers for new blocks
     * - Get the events from the new blocks
     * - Enqueue the events
     * - Restart listening if the provider is not already listened to
     */
    async listen() {
        this.listening = true;
        this.providers.forEach(async (provider) => {
            try {
                if (!this.listenedProviders.has(provider._getConnection().url)) {
                    console.log("Listening to " + provider._getConnection().url);
                    this.listenedProviders.add(provider._getConnection().url);
                    provider.on("block", async (blockNumber) => {
                        const filter = {
                            fromBlock: blockNumber,
                            topics: [ethers.id("CallbackEvent(string,string,bytes[])")],
                        };
                        const events = await provider.getLogs(filter);
                        for await (const event of events) {
                            let isStrategy = await isYCStrategy(event.address);
                            if (isStrategy)
                                this.enqueue({
                                    ...event,
                                    json_rpc_url: provider._getConnection().url,
                                });
                        }
                    });
                }
            }
            catch (err) {
                console.log("Error Listening on Provider With JSONRPC: ", provider._getConnection().url, "Chain ID: ", provider._network.chainId, "Error: ", err);
            }
        });
    }
    // Stop listening to the providers
    async stopListening() {
        this.listening = false;
        this.providers.forEach((provider) => {
            provider.removeAllListeners();
        });
    }
    // Restart listening to the providers
    async restartListeners() {
        this.stopListening();
        this.listenedProviders.clear();
        this.listen();
    }
}
// Initialize the event queue
let eventQueue = new EventQueue();
// Add a provider to listen to while the app is running (Will be mainly used for forks)
app.post("/add-provider", async (req, res) => {
    const { url } = req.body;
    eventQueue.addProvider(url);
    res.send("Provider added");
});
// Stop listening to the providers
app.post("/stop-listening", async (req, res) => {
    eventQueue.stopListening();
    res.send("Stopped listening");
});
app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
    eventQueue.startHandling();
});
/**
 * Checks if an address is a YC strategy contract
 * @param address The address to check
 * @returns Whether it is a YC strategy or not
 */
const isYCStrategy = async (address) => {
    let full_strategies_list = (await axios.get("https://api.yieldchain.io/strategies")).data.strategies;
    let is_a_strategy = full_strategies_list.findIndex((stratObj) => ethers.getAddress(stratObj.address) == ethers.getAddress(address)) >= 0
        ? true
        : false;
    if (is_a_strategy)
        return true;
    else
        return false;
};
//# sourceMappingURL=index.js.map