/**
 * Class representing an hydration request
 * @param hydrationRequest - Ethers log representing an hydration request
 * @param network - A supported YC network to fork & simulate on top of
 */
import { AbiCoder, Contract, ZeroAddress } from "ethers";
import VaultAbi from "@yc/yc-models/src/ABIs/strategy.json" assert { type: "json" };
import { simulateHydrationRequest } from "../utils/simulate-hydration-request.js";
export class HydrationRequest {
    #request;
    #network;
    constructor(hydrationRequest, network) {
        this.#request = hydrationRequest;
        this.#network = network;
    }
    /**
     * @notice
     * Simulate this hydration request and return the hydrated command calldatas
     */
    async simulateHydration() {
        return await simulateHydrationRequest(this);
    }
    /**
     * Get the operation index requested here
     * @return OperationItem | null - OperationItem if found, null if not
     */
    async getOperation() {
        const opIndex = AbiCoder.defaultAbiCoder().decode(["uint256"], this.#request.topics[1])[0];
        if (typeof opIndex !== "bigint") {
            console.error("Cannot Get Hydration Operation - Opindex Is Not A number. Opindex:", opIndex);
            return null;
        }
        const strategyContract = new Contract(this.#request.address, VaultAbi, this.#network.provider);
        const opItem = await strategyContract.getOperationItem(opIndex);
        if (opItem?.initiator && opItem.initiator !== ZeroAddress)
            return opItem;
        return null;
    }
    /**
     * Get the operation index
     */
    get operationIndex() {
        return AbiCoder.defaultAbiCoder().decode(["uint256"], this.#request.topics[1])[0];
    }
    /**
     * Get the address of the strategy that emitted the request
     */
    get strategyAddress() {
        return this.#request.address;
    }
    /**
     * Get the network
     */
    get network() {
        return this.#network;
    }
    /**
     * Get the gas bundled with this transaction
     */
    async getGasLimit(fork) {
        const operation = await this.getOperation();
        const gasPrice = await fork.gasPrice();
        if (!operation?.gas)
            throw "Cannot Get Gas Limit - Operation Gas Undefined";
        return BigInt(operation.gas) / BigInt(gasPrice);
    }
}
//# sourceMappingURL=hydration-request.js.map