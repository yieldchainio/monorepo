/**
 * Create a fork
 */
import { Fork } from "@yc/anvil-ts";
export async function createFork(network) {
    if (!network.available || !network.jsonRpc)
        throw new Error("YCNetwork ERROR: Cannot Fork (Network Is Not Integrated - JSON RPC UNAVAILABLE)");
    const fork = await Fork.fromRpcUrl(network.jsonRpc);
    return fork;
}
//# sourceMappingURL=create-fork.js.map