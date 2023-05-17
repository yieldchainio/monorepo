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
        await this.stopListening();
        try {
            for (let i = 0; i < this.networks.length; i++)
                this.listen(i);
        }
        catch (e) {
            console.error("Caught Error While Listening For Onchain Events. Error:", e);
            console.log("Restarting Connections...");
            await this.listenToAll();
        }
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
        console.log("Listening For Provider", jsonRPC, "Percentage Of Retries Used:", `${(retry / this.maxConnectionRetries) * 100}%`);
        if (!provider)
            throw "Cannot Listen To Onchain Provider - Undefined At Index";
        try {
            const filter = {
                topics: [ethers.id(this.eventSignature)],
            };
            provider.on(filter, async (event) => {
                console.log("Caught Event!", event.topics?.[1]);
                this.eventHandler(event, network);
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
            await network.provider.removeAllListeners();
    }
    // Restart listening to the providers
    async restartListeners() {
        this.stopListening();
        this.listenToAll();
    }
}
//# sourceMappingURL=onchain-listener.js.map