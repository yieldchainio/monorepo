import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
} from "react-router-dom";
import { Protocols } from "./Protocols";
import { ProtocolList } from "./protocolList";
import { StrategyInitiation } from "./StrategyInitiation";
import { StrategyBuilder } from "./StrategyBuilder/StrategyBuilder";
import { useEffect, useContext } from "react";
import Header from "./Components/Layout/Header/Header";
import DashBoardPage from "./dashboardpage";
import DatabaseContextProvider from "./Contexts/DatabaseContext";
import { StrategyContextProvider } from "./Contexts/DatabaseContext";
import { DatabaseContext, StrategyContext } from "./Contexts/DatabaseContext";
import { BaseStrategyMiniTab } from "./BaseStrategyTab";
import { BaseStrategyLargeTab } from "./BaseStrategyTab";
import { BaseStrategyTab } from "./BaseStrategyTab";
import { RightLine, LeftLine, StraightLine } from "./Lines";
import { LandingPage } from "./LandingPage";
import { WhitelistingPage } from "./whitelistingPage";
import "@rainbow-me/rainbowkit/styles.css";

import {
  ConnectButton,
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, useSigner, WagmiConfig } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  bsc,
  avalanche,
} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";

const { chains, provider } = configureChains(
  [bsc, arbitrum],
  [
    publicProvider(),
    alchemyProvider({ apiKey: "Ywds7ION4p9EBgz93_pF-KwfytqSF8-J" }),
  ]
);

const { connectors } = getDefaultWallets({ appName: "Yieldchain App", chains });

const wagmiClient = createClient({
  autoConnect: true,
  connectors: connectors,
  provider,
});

const Todo = (props: any) => {
  return (
    <div
      style={{
        backgroundColor: "black",
      }}
    >
      <ConnectButton />
      <h1
        style={{
          position: "absolute",
          top: "30vh",
          left: "50vw",
          transform: "translate(-50%, -50%)",
          fontSize: "100px",
          whiteSpace: "nowrap",
        }}
      >
        Check Todo List ^
      </h1>
    </div>
  );
};

function ReadContext() {
  const {
    fullProtocolsList,
    fullPoolsList,
    fullNetworksList,
    fullTokensList,
    fullStrategiesList,
    fullProtocolsNetworksList,
  } = useContext(DatabaseContext);
  return null;
}

function ReadStrategyContext() {
  const {
    strategyName,
    setStrategyName,
    executionIntrval,
    setExecutionInterval,
    baseSteps,
    setBaseSteps,
    strategySteps,
    setStrategySteps,
  } = useContext(StrategyContext);
  return null;
}

function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";

    //TODO: Update meta titles and descriptions below
    switch (pathname) {
      case "/":
        title = "";
        metaDescription = "";
        break;
      case "/dashboard":
        title = "";
        metaDescription = "";
        break;
      case "/dashboard":
        title = "";
        metaDescription = "";
        break;
      case "/main-dashboard":
        title = "";
        metaDescription = "";
        break;
      case "/dashboard":
        title = "";
        metaDescription = "";
        break;
      case "/dashboard":
        title = "";
        metaDescription = "";
        break;
      case "/dashboard":
        title = "";
        metaDescription = "";
        break;
      case "/dashboard":
        title = "";
        metaDescription = "";
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag: HTMLMetaElement | null = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  let baseStrategyPaths = ["protocols"];


  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <DatabaseContextProvider>
          <StrategyContextProvider>
            <ReadStrategyContext />
            <ReadContext />

            <div>
              {window.location.host.split(".")[0] == "app" ? (
                <div>
                  <Routes>
                    <Route path="/" element={<DashBoardPage />} />
                  </Routes>
                  {baseStrategyPaths.includes(pathname.split("/")[1]) ? (
                    <BaseStrategyTab />
                  ) : null}
                  <Header />
                  <Routes>
                    <Route path="/initiate" element={<StrategyInitiation />} />
                    <Route path="/protocols" element={<ProtocolList />} />
                    <Route
                      path="/protocols/:protocolIdentifier"
                      element={<Protocols />}
                    />
                    <Route
                      path="/strategy-builder/"
                      element={<StrategyBuilder />}
                    />
                  </Routes>
                </div>
              ) : (
                <div>
                  <Routes>
                    <Route path="/whitelist" element={<WhitelistingPage />} />
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/todo" element={<Todo />} />
                  </Routes>
                </div>
              )}
            </div>
          </StrategyContextProvider>
        </DatabaseContextProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
export default App;
