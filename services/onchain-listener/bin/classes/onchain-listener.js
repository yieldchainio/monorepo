import { ethers } from "ethers";
export class OnchainListener {
    // The providers to listen to
    networks = [];
    // Maximum amount of attempts of reconnecting on failures
    maxConnectionRetries;
    // The handler for each onchain event
    eventHandler;
    // The event signature to listen to
    eventSignature;
    // Add initial provider(s) to listen to when running the app
    constructor(eventSignature, eventHandler, providers, maxConnectionRetries) {
        this.eventSignature = eventSignature;
        this.eventHandler = eventHandler;
        this.networks = providers;
        this.maxConnectionRetries = maxConnectionRetries;
    }
    /**
     * @notice
     * Listen to all providers
     */
    async listenToAll() {
        const promises = [];
        for (let i = 0; i < this.networks.length; i++)
            promises.push(this.listen(i));
        await Promise.all(promises);
        await this.listenToAll();
    }
    /**
     * Listen to a single provider
     */
    async listen(providerIdx, retry = 0) {
        if (retry >= this.maxConnectionRetries)
            return;
        const network = this.networks[providerIdx];
        const provider = network.provider;
        const jsonRPC = provider._getConnection().url;
        if (!provider)
            throw "Cannot Listen To Onchain Provider - Undefined At Index";
        try {
            provider.on("block", async (blockNumber) => {
                const filter = {
                    fromBlock: blockNumber,
                    topics: [ethers.id(this.eventSignature)],
                };
                const events = await provider.getLogs(filter);
                for await (const event of events)
                    await this.eventHandler(event, network);
            });
        }
        catch (e) {
            console.error("Caught Error While Listening To Provider On JSON RPC:", jsonRPC, ":");
            console.error(e);
            console.log("Restarting Connection...");
            this.listen(providerIdx, retry + 1);
        }
    }
    /**
     * Stop listening to all providers
     */
    async stopListening() {
        for (const network of this.networks)
            network.provider.removeAllListeners();
    }
    // Restart listening to the providers
    async restartListeners() {
        this.stopListening();
        this.listenToAll();
    }
}
//# sourceMappingURL=onchain-listener.js.map