import { JsonRpcProvider } from "ethers";
import { findAvailablePort } from "../utils/find-available-port.js";
import { exec } from "child_process";
/**
 * Main fork class
 * @extends ethers.JsonRpcProvider
 * @param rpcUrl - The RPC Url to fork
 * @return Fork instance, extends the ethers provider class that provides all different methods on it. Also provides
 * different methods for abstracting use with Anvil-specific fork RPC methods
 */
export class Fork extends JsonRpcProvider {
    /**
     * Should only be initiallized using this static function,
     * because we need to super the new RPC url which takes time ot resolve (finding a free port)
     */
    static async fromRpcUrl(rpcURL) {
        const availablePort = await findAvailablePort(3000);
        const cmd = `anvil --fork-url ${rpcURL} --port ${availablePort}`;
        console.log("Gonna exec this cmd:", cmd);
        const cmRes = exec(cmd);
        console.log("CMD Res", cmRes);
        await new Promise((res) => cmRes.stdout?.on("data", (chunck) => {
            if (chunck.includes("Listening on")) {
                console.log("Got Listening", chunck);
                res(true);
            }
        }));
        console.log("Fork Is Listening...");
        cmRes.stdout?.on("data", (chunck) => console.log("Got Log! Log:", chunck));
        console.log("listened for data");
        return new Fork(availablePort, cmRes);
    }
    #port;
    #process;
    constructor(availablePort, process) {
        const newRPCURL = `http://127.0.0.1:${availablePort}`;
        super(newRPCURL);
        this.#process = process;
        this.#port = availablePort;
    }
    async enableLog() {
        await this.send("anvil_setLoggingEnabled", [true]);
    }
    /**
     * Prank an address
     */
    async prank(address) {
        await this.send("anvil_impersonateAccount", [address]);
    }
    /**
     * Auto prank all addresses
     */
    async autoClownster() {
        await this.send("anvil_autoImpersonateAccount", [true]);
    }
    /**
     * Stop pranking an address
     */
    async stopPrank() {
        await this.send("anvil_stopImpersonatingAccount", []);
    }
    // We cache it (Can only use one at a time, so pointless returning to user)
    #snapshotID = null;
    /**
     * Snapshot the state to later revert to
     */
    async snap() {
        this.#snapshotID = await this.send("evm_snapshot", []);
    }
    /**
     * Revert to snap
     */
    async rollback() {
        if (this.#snapshotID == null)
            throw "Cannot Rollback - Snapshot Was Never Taken";
        await this.send("evm_revert", [this.#snapshotID]);
    }
    /**
     * Change byteconde at contract
     */
    async etch(address, newCode) {
        await this.send("anvil_setCode", [address, newCode]);
    }
    /**
     * Write to storage manually
     */
    async write(address, slot, newValue) {
        await this.send("anvil_setStorageAt", [address, slot, newValue]);
    }
    /**
     * Kill the fork
     */
    kill() {
        const success = this.#process.kill();
        return success;
    }
    /**
     * Get current gas price
     */
    async gasPrice() {
        return await this.send("eth_gasPrice", []);
    }
    /**
     * Enable trace
     */
    async enableTraces() {
        return await this.send("anvil_enableTraces", []);
    }
    /**
     * Trace a transaction
     */
    async traceTxn(txn) {
        return await this.send("debug_traceTransaction", [txn]);
    }
    /**
     * Mine a block
     */
    async mine() {
        return await this.send("evm_mine", []);
    }
    /**
     * Disable automine
     */
    async disableAutoMine() {
        return await this.send("evm_setAutomine", [false]);
    }
    /**
     * Enable automine
     */
    async enableAutoMine() {
        return await this.send("evm_setAutomine", [true]);
    }
}
//# sourceMappingURL=fork.js.map