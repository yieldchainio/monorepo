import { JsonRpcProvider, Log, ethers } from "ethers";
import { HYDRATE_RUN_ONCHAIN_EVENT_HASH } from "../constants.js";
import { EthersJsonRpcProvider } from "@yc/yc-models";
import { SupportedYCNetwork } from "../types.js";

export class OnchainListener {
  // The providers to listen to
  private networks: SupportedYCNetwork[] = [];

  // Maximum amount of attempts of reconnecting on failures
  readonly maxConnectionRetries: number;

  // The handler for each onchain event
  readonly eventHandler: (
    onchainEvent: Log,
    provider: SupportedYCNetwork
  ) => Promise<void>;

  // The event signature to listen to
  readonly eventSignature: string;

  // Add initial provider(s) to listen to when running the app
  constructor(
    eventSignature: string,
    eventHandler: (
      onchainEvent: Log,
      provider: SupportedYCNetwork
    ) => Promise<void>,
    providers: SupportedYCNetwork[],
    maxConnectionRetries: number
  ) {
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
    const promises: Promise<void>[] = [];
    for (let i = 0; i < this.networks.length; i++)
      promises.push(this.listen(i));

    await Promise.all(promises);
    await this.listenToAll();
  }

  /**
   * Listen to a single provider
   */
  async listen(providerIdx: number, retry: number = 0) {
    if (retry >= this.maxConnectionRetries) return;

    const network = this.networks[providerIdx];
    const provider = network.provider;
    const jsonRPC = provider._getConnection().url;

    if (!provider)
      throw "Cannot Listen To Onchain Provider - Undefined At Index";

    try {
      provider.on("block", async (blockNumber: any) => {
        const filter = {
          fromBlock: blockNumber,
          topics: [ethers.id(this.eventSignature)],
        };

        const events = await provider.getLogs(filter);

        for await (const event of events)
          await this.eventHandler(event, network);
      });
    } catch (e: any) {
      console.error(
        "Caught Error While Listening To Provider On JSON RPC:",
        jsonRPC,
        ":"
      );
      console.error(e);
      console.log("Restarting Connection...");
      this.listen(providerIdx, retry + 1);
    }
  }

  /**
   * Stop listening to all providers
   */
  async stopListening() {
    for (const network of this.networks) network.provider.removeAllListeners();
  }

  // Restart listening to the providers
  async restartListeners() {
    this.stopListening();
    this.listenToAll();
  }
}
