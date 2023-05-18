/**
 * Create a fork
 */

import { SupportedYCNetwork } from "@yc/yc-models";
import ganache from "ganache";
import findAvailablePort from "./find-available-port.js";
import { JsonRpcProvider } from "ethers";

export async function createFork(network: SupportedYCNetwork) {
  if (!network.available || !network.jsonRpc)
    throw new Error(
      "YCNetwork ERROR: Cannot Fork (Network Is Not Integrated - JSON RPC UNAVAILABLE)"
    );

  const server = ganache.server({
    fork: {
      url: network.jsonRpc,
    },
    logging: {
      logger: {
        log: (msg: any) => console.log("Ganache Log:", msg),
      },
    },
    wallet: {
      unlockedAccounts: [network.diamondAddress],
    },
  });

  const port = await findAvailablePort(3000);

  server.listen(port, async (e: any) => {
    if (e) {
      console.log("Error starting ganache server", e);
    } else {
      console.log("Ganache server started on port", port);
    }
  });

  return new JsonRpcProvider(`http://localhost:${port}/`);
}
