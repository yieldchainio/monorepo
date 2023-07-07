/**
 * Processor of blocks and transactions
 */
export class BlocksQueue {
    #network;
    #blockProcessor;
    #queue = [];
    #isProcessing = false;
    #usedBlocks = new Set();
    #isValidBlock = (num) => {
        if (this.#usedBlocks.has(num))
            return false;
        this.#usedBlocks.add(num);
        return true;
    };
    constructor(network, blockProcessor) {
        this.#network = network;
        this.#blockProcessor = blockProcessor;
    }
    async start() {
        await this.#network.provider.on("block", async (blockNum) => {
            this.#queue.push(blockNum);
            if (!this.#isProcessing)
                this.#process();
        });
    }
    async #process() {
        this.#isProcessing = true;
        while (this.#queue.length) {
            const blockNum = this.#queue.shift();
            if (!this.#isValidBlock(blockNum))
                continue;
            console.log(`Processing Block #${blockNum} On ${this.#network.name}...`);
            await this.#blockProcessor(blockNum);
        }
        this.#isProcessing = false;
    }
}
//# sourceMappingURL=blocks-queue.js.map