"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_router_dom_1 = require("react-router-dom");
const Protocols_1 = require("./Protocols");
const protocolList_1 = require("./protocolList");
const StrategyInitiation_1 = require("./StrategyInitiation");
const StrategyBuilder_1 = require("./StrategyBuilder/StrategyBuilder");
const react_1 = require("react");
const Header_1 = __importDefault(require("./Components/Layout/Header/Header"));
const dashboardpage_1 = __importDefault(require("./dashboardpage"));
const DatabaseContext_1 = __importDefault(require("./Contexts/DatabaseContext"));
const DatabaseContext_2 = require("./Contexts/DatabaseContext");
const DatabaseContext_3 = require("./Contexts/DatabaseContext");
const BaseStrategyTab_1 = require("./BaseStrategyTab");
const LandingPage_1 = require("./LandingPage");
const whitelistingPage_1 = require("./whitelistingPage");
require("@rainbow-me/rainbowkit/styles.css");
const rainbowkit_1 = require("@rainbow-me/rainbowkit");
const wagmi_1 = require("wagmi");
const chains_1 = require("wagmi/chains");
const alchemy_1 = require("wagmi/providers/alchemy");
const public_1 = require("wagmi/providers/public");
const { chains, provider } = (0, wagmi_1.configureChains)([chains_1.bsc, chains_1.arbitrum], [
    (0, public_1.publicProvider)(),
    (0, alchemy_1.alchemyProvider)({ apiKey: "Ywds7ION4p9EBgz93_pF-KwfytqSF8-J" }),
]);
const { connectors } = (0, rainbowkit_1.getDefaultWallets)({ appName: "Yieldchain App", chains });
const wagmiClient = (0, wagmi_1.createClient)({
    autoConnect: true,
    connectors: connectors,
    provider,
});
const Todo = (props) => {
    return (<div style={{
            backgroundColor: "black",
        }}>
      <rainbowkit_1.ConnectButton />
      <h1 style={{
            position: "absolute",
            top: "30vh",
            left: "50vw",
            transform: "translate(-50%, -50%)",
            fontSize: "100px",
            whiteSpace: "nowrap",
        }}>
        Check Todo List ^
      </h1>
    </div>);
};
function ReadContext() {
    const { fullProtocolsList, fullPoolsList, fullNetworksList, fullTokensList, fullStrategiesList, fullProtocolsNetworksList, } = (0, react_1.useContext)(DatabaseContext_3.DatabaseContext);
    return null;
}
function ReadStrategyContext() {
    const { strategyName, setStrategyName, executionIntrval, setExecutionInterval, baseSteps, setBaseSteps, strategySteps, setStrategySteps, } = (0, react_1.useContext)(DatabaseContext_3.StrategyContext);
    return null;
}
function App() {
    const action = (0, react_router_dom_1.useNavigationType)();
    const location = (0, react_router_dom_1.useLocation)();
    const pathname = location.pathname;
    (0, react_1.useEffect)(() => {
        if (action !== "POP") {
            window.scrollTo(0, 0);
        }
    }, [action]);
    (0, react_1.useEffect)(() => {
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
            const metaDescriptionTag = document.querySelector('head > meta[name="description"]');
            if (metaDescriptionTag) {
                metaDescriptionTag.content = metaDescription;
            }
        }
    }, [pathname]);
    let baseStrategyPaths = ["protocols"];
    return (<wagmi_1.WagmiConfig client={wagmiClient}>
      <rainbowkit_1.RainbowKitProvider chains={chains} theme={(0, rainbowkit_1.darkTheme)()}>
        <DatabaseContext_1.default>
          <DatabaseContext_2.StrategyContextProvider>
            <ReadStrategyContext />
            <ReadContext />

            <div>
              {window.location.host.split(".")[0] == "app" ? (<div>
                  <react_router_dom_1.Routes>
                    <react_router_dom_1.Route path="/" element={<dashboardpage_1.default />}/>
                  </react_router_dom_1.Routes>
                  {baseStrategyPaths.includes(pathname.split("/")[1]) ? (<BaseStrategyTab_1.BaseStrategyTab />) : null}
                  <Header_1.default />
                  <react_router_dom_1.Routes>
                    <react_router_dom_1.Route path="/initiate" element={<StrategyInitiation_1.StrategyInitiation />}/>
                    <react_router_dom_1.Route path="/protocols" element={<protocolList_1.ProtocolList />}/>
                    <react_router_dom_1.Route path="/protocols/:protocolIdentifier" element={<Protocols_1.Protocols />}/>
                    <react_router_dom_1.Route path="/strategy-builder/" element={<StrategyBuilder_1.StrategyBuilder />}/>
                  </react_router_dom_1.Routes>
                </div>) : (<div>
                  <react_router_dom_1.Routes>
                    <react_router_dom_1.Route path="/whitelist" element={<whitelistingPage_1.WhitelistingPage />}/>
                    <react_router_dom_1.Route path="/" element={<LandingPage_1.LandingPage />}/>
                    <react_router_dom_1.Route path="/todo" element={<Todo />}/>
                  </react_router_dom_1.Routes>
                </div>)}
            </div>
          </DatabaseContext_2.StrategyContextProvider>
        </DatabaseContext_1.default>
      </rainbowkit_1.RainbowKitProvider>
    </wagmi_1.WagmiConfig>);
}
exports.default = App;
//# sourceMappingURL=App.js.map