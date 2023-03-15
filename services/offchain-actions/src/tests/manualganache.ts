import ganache, { ServerOptions } from "ganache";

// ARbi chain id
const chainId: number = 42161;

const json_rpc_url: string =
  "https://arb-mainnet.g.alchemy.com/v2/Bva4kx5jvnUcfxDPwzW_iTO94JAw3ACP";

// Options
const ganacheOptions: ServerOptions = {
  chain: {
    chainId: chainId,
  },
  fork: {
    url: json_rpc_url,
  },

  logging: {
    logger: {
      // dont wanna see all that shit
      log: (msg: any) => console.log("Ganache Log:", msg),
    },
  },
};

// Start ganache server
const server = ganache.server(ganacheOptions);

server.listen(8545, async (e: any) => {
  if (e) {
    console.log("Error starting ganache server", e);
  } else {
    console.log("Ganache server started");
  }
});
