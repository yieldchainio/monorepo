"use client";
import "@rainbow-me/rainbowkit/styles.css";
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, bsc } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { useIsMounted } from "utilities/hooks/general/useIsMounted";

const { chains, provider } = configureChains(
  [bsc, arbitrum, polygon, optimism, mainnet],
  [
    publicProvider(),
    alchemyProvider({ apiKey: "Ywds7ION4p9EBgz93_pF-KwfytqSF8-J" }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Yieldcchain App",
  chains,
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

interface WrappedWagmiProps {
  children: React.ReactNode;
}
const WrappedWagmi = ({ children }: WrappedWagmiProps) => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default WrappedWagmi;
