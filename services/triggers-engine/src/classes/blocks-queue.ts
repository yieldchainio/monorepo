/**
 * Processor of blocks and transactions
 */

import { YCNetwork } from "@yc/yc-models";
import { Block, Provider } from "ethers";

export class BlocksQueue {
  #network: YCNetwork & { provider: Provider };

  #blockProcessor: (block: number) => void | Promise<void>;

  #queue: number[] = [];
  #isProcessing: boolean = false;

  #usedBlocks = new Set<number>();

  #isValidBlock = (num: number) => {
    if (this.#usedBlocks.has(num)) return false;
    this.#usedBlocks.add(num);
    return true;
  };

  constructor(
    network: YCNetwork & { provider: Provider },
    blockProcessor: (blockNum: number) => Promise<void> | void
  ) {
    this.#network = network;
    this.#blockProcessor = blockProcessor;
  }

  async start() {
    await this.#network.provider.on("block", async (blockNum: number) => {
      this.#queue.push(blockNum);
      if (!this.#isProcessing) this.#process();
    });
  }

  async #process() {
    this.#isProcessing = true;

    while (this.#queue.length) {
      const blockNum: number = this.#queue.shift() as number;
      if (!this.#isValidBlock(blockNum)) continue;
      console.log(`Processing Block #${blockNum} On ${this.#network.name}...`);
      await this.#blockProcessor(blockNum);
    }

    this.#isProcessing = false;
  }
}
