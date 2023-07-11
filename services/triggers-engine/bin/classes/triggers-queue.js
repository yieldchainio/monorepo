import { AbiCoder } from "ethers";
import { EMPTY_BYTES_ARRAY, IsTriggerNotReadyError, isInsufficientGasBalanceError, } from "../constants.js";
export class TriggersQueue {
    #signer;
    #diamondContract;
    constructor(signer, diamondContract) {
        this.#signer = signer;
        this.#diamondContract = diamondContract;
    }
    #queue = [];
    #isHandling = false;
    push(vault, triggerIdx) {
        this.#queue.push({
            vault,
            triggerIdx,
        });
        if (!this.#isHandling)
            this.#handle();
    }
    async #handle() {
        this.#isHandling = true;
        while (this.#queue.length) {
            const { vault, triggerIdx } = this.#queue.shift();
            try {
                const encodedParams = AbiCoder.defaultAbiCoder().encode(["address", "uint256"], [vault, triggerIdx]);
                const callData = await this.#diamondContract.executeStrategyTriggerWithData.resolveOffchainData(EMPTY_BYTES_ARRAY, encodedParams, {
                    enableCcipRead: true,
                    blockTag: "latest",
                });
                await this.#signer.sendTransaction({
                    to: await this.#diamondContract.getAddress(),
                    data: callData,
                });
            }
            catch (error) {
                // If simply not ready we continue on, otherwise throw the exception
                if (IsTriggerNotReadyError(error))
                    continue;
                if (isInsufficientGasBalanceError(error))
                    continue;
                console.error("[TriggersEngine]: Caught Unknown Exception While Preparing Trigger Execution.", error);
            }
        }
        this.#isHandling = false;
    }
}
//# sourceMappingURL=triggers-queue.js.map