/**
 * Create a fork
 */
import ganache from "ganache";
import findAvailablePort from "./find-available-port.js";
import { JsonRpcProvider } from "ethers";
export async function createFork(network) {
    if (!network.available || !network.jsonRpc)
        throw new Error("YCNetwork ERROR: Cannot Fork (Network Is Not Integrated - JSON RPC UNAVAILABLE)");
    const server = ganache.server({
        fork: {
            url: network.jsonRpc,
        },
        logging: {
            logger: {
                log: (msg) => console.log("Ganache Log:", msg),
            },
        },
    });
    const port = await findAvailablePort(3000);
    server.listen(port, async (e) => {
        if (e) {
            console.log("Error starting ganache server", e);
        }
        else {
            console.log("Ganache server started");
        }
    });
    return new JsonRpcProvider(`http://localhost:${port}/`);
}
//# sourceMappingURL=create-fork.js.map