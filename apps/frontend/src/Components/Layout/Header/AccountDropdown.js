"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("react");
const DatabaseContext_1 = require("../../../Contexts/DatabaseContext");
const LandingPage_1 = require("../../../LandingPage");
const ethereum = window.ethereum;
const AccountDropdown = () => {
    /**
     * Gets Web3 Account Available Currently Through Window.Ethereum
     */
    const { accountAddress, setAccountAddress } = (0, react_2.useContext)(DatabaseContext_1.DatabaseContext);
    const getAccounts = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const account = accounts[0];
            return account;
        }
    };
    let context;
    // Checks if the user is authenticated currently through a web3 wallet.
    const [isAuthenticated, setIsAuthenticated] = (0, react_2.useState)(ethereum === null || ethereum === void 0 ? void 0 : ethereum.isConnected());
    // Keeps track of the user hovering the button
    const [isHovering, setIsHovering] = (0, react_2.useState)(false);
    // The user's address
    // const [accountAddress, setAccountAddress] = useState("Just A Sec...");
    const handleMouseOver = () => {
        setIsHovering(true);
    };
    // Fetches The Account Address On Mount, If already authenticated previously
    (0, react_2.useEffect)(() => {
        (async () => {
            const accounts = await getAccounts().then((res) => setAccountAddress(res));
        })();
        return () => {
            // Component unmount code.
        };
    }, []);
    const handleMouseOut = () => {
        setIsHovering(false);
    };
    // Handles the connect button click, prompts the user to connect their wallet
    const connectButtonOnClick = () => {
        if (typeof window !== "undefined") {
            getAccounts().then((response) => {
                setAccountAddress(response);
                setIsAuthenticated(!isAuthenticated);
            });
        }
    };
    // Handles the disconnect button click, simply makes the address goes away (To properly disconnent, the user must disconnect directly within wallet)
    const disconnectButtonOnClick = () => {
        setIsAuthenticated(!isAuthenticated);
    };
    return (<div style={{ position: "absolute", left: "1030px", top: "40px" }}>
      <LandingPage_1.ConnectWalletButtonCustom showNetwork={false}/>
    </div>);
};
exports.default = AccountDropdown;
//# sourceMappingURL=AccountDropdown.js.map