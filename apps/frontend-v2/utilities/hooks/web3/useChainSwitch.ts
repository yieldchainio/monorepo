import { useNetwork, useSwitchNetwork, Chain } from "wagmi";

export const useChainSwitch = () => {
  // Get all chains
  const { chains, chain }: { chains: Chain[]; chain?: Chain } = useNetwork();

  // Get the switchNetworkAsync function, set it to call addChain on error
  const { switchNetworkAsync } = useSwitchNetwork({
    onError: async (
      err: Error,
      args: {
        chainId: number;
      }
    ) => {
      // Get our chain
      const chain = chains.find((chain: Chain) => chain.id == args.chainId);

      // When catching an error, if we found our chain we call addChain then
      if (chain) {
        // Call addChain, save boolean return value (whether chain was added or not)
        const chainAdded: boolean = await addChain(chain);

        // If chain was added, we recruse the call to switch to it. THis time we input chain object
        // manually for increased efficency
        if (chainAdded) await switchNetwork(args.chainId);

        // If we did not get a chain at all, we throw an error
      } else
        throw new Error(
          "Chain does not exist!, in onError!!!!!!!!! SEr!!!!!!!"
        );
    },
  });

  /**
   * Switch the user's Chain,
   * @uses addChain() if chain is not in user's wallet
   * @param chainId - Chain ID of the chain
   */
  const switchNetwork = async (_chainId: number) => {
    if (switchNetworkAsync)
      try {
        await switchNetworkAsync(
          ("0x" + _chainId.toString(16)) as unknown as number
        );
      } catch (e: any) {
        // Get our chain
        const chain = chains.find((chain: Chain) => chain.id == _chainId);

        // When catching an error, if we found our chain we call addChain then
        if (chain) {
          // Call addChain, save boolean return value (whether chain was added or not)
          const chainAdded: boolean = await addChain(chain);

          // If chain was added, we recruse the call to switch to it. THis time we input chain object
          // manually for increased efficency
          if (chainAdded) await switchNetwork(_chainId);

          // If we did not get a chain at all, we throw an error
        } else {
          console.log(
            "Your chain:",
            chain,
            "Your chain ID:",
            _chainId,
            "Chains ser:",
            chains
          );
          throw new Error("Chain does not exist!)");
        }
      }
    else throw new Error("switchNetworkAsync Does not Exist!!");
  };

  return { switchNetwork, chain };
};

/**
 * Add a chain to the user's web3 wallet
 * @param chain - The chain object to add
 * @returns
 */
const addChain = async (chain: Chain): Promise<boolean> => {
  return (
    (await window?.ethereum?.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: chain.id.toString(),
          chainName: chain.name,
          nativeCurrency: {
            name: chain.nativeCurrency.name,
            /** 2-6 characters long */
            symbol: chain.nativeCurrency.symbol,
            decimals: chain.nativeCurrency.decimals,
          },
          rpcUrls: [`${chain.rpcUrls.default.http}`],
          blockExplorerUrls: [`${chain.blockExplorers?.default.url}`],
        },
      ],
    })) || false
  );
};
