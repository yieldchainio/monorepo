import {
  EventFilter,
  JsonRpcProvider,
  Log,
  ProviderEvent,
  ethers,
} from "ethers";
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
    await this.stopListening();
    try {
      for (let i = 0; i < this.networks.length; i++) this.listen(i);
    } catch (e: any) {
      console.error(
        "Caught Error While Listening For Onchain Events. Error:",
        e
      );
      console.log("Restarting Connections...");
      await this.listenToAll();
    }
  }

  /**
   * Listen to a single provider
   */
  async listen(providerIdx: number, retry: number = 0) {
    if (retry >= this.maxConnectionRetries) return;

    console.log(
      "Listening For Provider At Idx",
      providerIdx,
      "Percentage Of Retries Used:",
      `${(retry / this.maxConnectionRetries) * 100}%`
    );

    const network = this.networks[providerIdx];
    const provider = network.provider;
    const jsonRPC = provider._getConnection().url;

    if (!provider)
      throw "Cannot Listen To Onchain Provider - Undefined At Index";

    try {
      const filter: EventFilter = {
        topics: [ethers.id(this.eventSignature)],
      };
      provider.on(filter, async (event, log) => {
        const events = await provider.getLogs(filter);

        for await (const event of events) {
          console.log("Caught Event! Event:", event);
          console.log("Log:", log);
          await this.eventHandler(event, network);
        }
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
    for (const network of this.networks)
      await network.provider.removeAllListeners();
  }

  // Restart listening to the providers
  async restartListeners() {
    this.stopListening();
    this.listenToAll();
  }
}
